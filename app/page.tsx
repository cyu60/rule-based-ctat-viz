"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [firstPart, setFirstPart] = useState<number>();
  const [firstPartPlusOne, setFirstPartPlusOne] = useState<number>();
  const [product, setProduct] = useState<number>();
  const [N, setN] = useState(25);
  const [final, setFinal] = useState<number>();
  const [done, setDone] = useState(false);

  const rules = [
    {
      label: "findFirstPart",
      condition: [
        {
          label: "IF there is a goal to determine the square of N",
          code: () => true,
        },
        {
          label: "And N ends in 5",
          code: () => N.toString()[N.toString().length - 1] === "5",
        },
        {
          label: "And we have not split off the first part",
          // Not updating even as we have a new firstPart when it is defined?
          code: () => {
            console.log("First Part(F1):", firstPart);
            return firstPart === undefined;
          },
        },
      ],
      action: [
        {
          label: "THEN",
          code: () => true,
        },
        {
          label: "Write Math.floor(N/10) as the first part",
          code: () => setFirstPart(Math.floor(N / 10)),
        },
      ],
    },
    {
      label: "addOne",
      condition: [
        {
          label: "IF there is a goal to determine the square of a number",
          code: () => true,
        },
        {
          label: "And we have split off the first part (call it F1)",
          code: () => {
            console.log("First Part(F1):", firstPart);
            return firstPart !== undefined;
          },
        },
        {
          label: "And we have not added 1 to the first part",
          code: () => firstPartPlusOne === undefined,
        },
      ],
      action: [
        {
          label: "THEN",
          code: () => true,
        },
        {
          label: "Write (F + 1) as the first part plus 1",
          code: () => setFirstPartPlusOne(firstPart! + 1),
        },
      ],
    },
    {
      label: "multiply",
      condition: [
        {
          label: "IF there is a goal to determine the square of a number",
          code: () => true,
        },
        {
          label: "And we have split off the first part (call it F1)",
          code: () => firstPart !== undefined,
        },
        {
          label: "And we have added 1 (call it F2)",
          code: () => firstPartPlusOne !== undefined,
        },
        {
          label: "And we have not determined the product yet",
          code: () => product === undefined,
        },
      ],
      action: [
        {
          label: "THEN",
          code: () => true,
        },
        {
          label: "Write (F1 * F2) as the product",
          code: () => setProduct(firstPart! * firstPartPlusOne!),
        },
      ],
    },
    {
      label: "append25",
      condition: [
        {
          label: "IF there is a goal to determine the square of a number",
          code: () => true,
        },
        {
          label: "And we have figured out the product (call it P)",
          code: () => product !== undefined,
        },
        {
          label: "And we have not appended 25 yet",
          code: () => N === 25,
        },
      ],
      action: [
        {
          label: "THEN",
          code: () => true,
        },
        {
          label: "Write (P * 100 + 25) as the final answer",
          code: () => {
            setFinal(product! * 100 + 25);
            setDone(true);
          },
        },
      ],
    },
  ];

  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [matchedRules, setMatchedRules] = useState<number[]>([]);
  type PhaseEnum = "Match" | "Conflict resolution" | "Action";
  const [phase, setPhase] = useState<PhaseEnum>("Match");

  const moveToNextPhase = () => {
    if (phase === "Match") {
      setPhase("Conflict resolution");
      toast("Move to Conflict Resolution Phase");
      // TODO: This doesn't seem to work...
      setCurrentRuleIndex(0);
      setCurrentLineIndex(0);
      // moveToNextPhase();
    } else if (phase === "Conflict resolution") {
      toast("Move to Action Phase, no conflict found.");

      setPhase("Action");

      // update to current rule -- this does not happen until update of state...
      // Expect there to be 1 rule, 1 match
      setCurrentRuleIndex(matchedRules[0]!);
      setCurrentLineIndex(0);
    } else if (phase === "Action") {
      !done && toast("Move to Match Phase");
      setPhase("Match");
      setMatchedRules([]);
      setCurrentLineIndex(0);
      setCurrentRuleIndex(0);
    }
  };

  const moveToNextRule = () => {
    // Find the next rule based on matching labels for the rules
    const nextRuleIndex = currentRuleIndex + 1;
    if (nextRuleIndex < rules.length) {
      setCurrentLineIndex(0);
      setCurrentRuleIndex(nextRuleIndex);
      // toast.info("Move to next rule: " + rules[nextRuleIndex].label);
    } else {
      // Move to the next phase
      moveToNextPhase();
    }
  };

  const handleNextStep = () => {
    if (phase === "Match") {
      if (done) {
        toast.success("Done!");
        return;
      }
      if (currentLineIndex < rules[currentRuleIndex].condition.length - 1) {
        console.log(firstPart);

        // const newIndex = currentLineIndex + 1;
        // Check if the current line is true
        // otherwise move to next rule
        // Issue is that current rule is not updated
        // const currentRuleIndex = rules.findIndex(r => r.label === currentRule.label)
        if (rules[currentRuleIndex].condition[currentLineIndex].code()) {
          setCurrentLineIndex((prevIndex) => prevIndex + 1);
          // !rules[currentRuleIndex].condition[currentLineIndex + 1].code() &&
          // toast.error("Condition not satisfied");
        } else {
          moveToNextRule();
        }
      } else {
        rules[currentRuleIndex].condition[currentLineIndex].code() &&
          // toast.success(
          //   "Add " + rules[currentRuleIndex].label + " to matched rules!"
          // );
          // Add to list of matched rules
          // Need to check for next one as well
          rules[currentRuleIndex].condition[currentLineIndex].code() &&
          setMatchedRules([...matchedRules, currentRuleIndex]);

        // Move to next rule function
        moveToNextRule();
      }
    }
    if (phase === "Conflict resolution") {
      // TODO: This doesn't seem to work...
      // setCurrentRuleIndex(rules[0]);

      // setCurrentLineIndex(0);
      moveToNextPhase();
    }
    if (phase === "Action") {
      // TODO: Patch this -- ensure that there should only be 1 update for everything!

      // execute on matched rule
      if (currentLineIndex < rules[currentRuleIndex].action.length - 1) {
        // Execute the current line index -- Need to add 1 to be hacky
        rules[currentRuleIndex].action[currentLineIndex + 1].code();
        console.log(
          "executing: " +
            rules[currentRuleIndex].action[currentLineIndex + 1].code.toString()
        );
        // update to the next line
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
      } else {
        moveToNextPhase();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex((prevIndex) => prevIndex - 1);
    } else {
      const prevRuleIndex = currentRuleIndex - 1;
      if (prevRuleIndex >= 0) {
        setCurrentRuleIndex(prevRuleIndex);
        setCurrentLineIndex(rules[prevRuleIndex].condition.length - 1);
      }
    }
  };
  return (
    <>
      <ToastContainer />
      <Header></Header>
      <main className="flex px-24 py-10 justify-center h-full items-center w-full space-y-5">
        <div className="flex flex-col sm:w-3/4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* First Card */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle>ITS State</CardTitle>
                <CardDescription>Tracks the state of the ITS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* <div className="flex-row h-10 flex items-center p-4"> */}
                {/* <p className="w-40">First part (F1):</p>{" "} */}
                <p className="font-bold h-10 p-4 items-center flex">
                  Find the square of 25
                </p>
                {/* Allow students to change the number? */}
                {/* If not 25, need to throw error toast and not update */}
                {/* <Input className="w-20" value={N} onChange={(e)=>setN(e.target.value)}></Input> */}
                {/* </div> */}
                <div className="flex-row h-10 flex items-center p-4">
                  <p className="w-40">First part (F1):</p>{" "}
                  <Input className="w-20" value={firstPart || ""}></Input>
                  {firstPart && (
                    <div className="flex flex-col text-green-600 bg-green-100 rounded-xl ml-4 items-center sm:w-48">
                      <div className="  text-center flex ">Modified by </div>
                      <span className="font-bold">{rules[0].label}</span>
                    </div>
                  )}
                </div>
                <div className="flex-row h-10 flex items-center p-4">
                  <p className="w-40">First part + 1 (F2):</p>{" "}
                  <Input
                    className="w-20"
                    value={firstPartPlusOne || ""}
                  ></Input>
                  {firstPartPlusOne && (
                    <div className="flex flex-col text-green-600 bg-green-100 rounded-xl ml-4 items-center sm:w-48">
                      <div className="  text-center flex ">Modified by </div>
                      <span className="font-bold">{rules[1].label}</span>
                    </div>
                  )}
                </div>
                <div className="flex-row h-10 flex items-center p-4">
                  <p className="w-40">Product (P):</p>{" "}
                  <Input className="w-20" value={product || ""}></Input>
                  {product && (
                    <div className="flex flex-col text-green-600 bg-green-100 rounded-xl ml-4 items-center sm:w-48">
                      <div className="  text-center flex ">Modified by </div>
                      <span className="font-bold">{rules[2].label}</span>
                    </div>
                  )}
                </div>
                <div className="flex-row h-10 flex items-center p-4">
                  <p className="w-40">Final Answer:</p>{" "}
                  <Input className="w-20" value={final || ""}></Input>
                  {final && (
                    <div className="flex flex-col text-green-600 bg-green-100 rounded-xl ml-4 items-center sm:w-48">
                      <div className="  text-center flex ">Modified by </div>
                      <span className="font-bold">{rules[3].label}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Second Card */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle>Program tracing</CardTitle>
                <CardDescription>Trace the program line</CardDescription>
              </CardHeader>
              <CardContent className="">
                <p className="font-bold h-10 p-4 items-center flex">
                  {rules[currentRuleIndex].label}
                </p>
                {rules[currentRuleIndex].condition.map((c, index) => (
                  <div key={index} className="flex items-center flex-row">
                    <div className="bg-white w-5 mr-2 pr-2">
                      {phase === "Match" && index === currentLineIndex ? (
                        <ArrowRight className="" color="black" />
                      ) : null}
                    </div>
                    <div
                      className={
                        phase === "Match" && index <= currentLineIndex
                          ? c.code()
                            ? "bg-green-200 h-10 p-4 flex items-center flex-grow"
                            : "bg-red-200 h-10 p-4 flex items-center flex-grow"
                          : "bg-indigo-200 h-10 p-4 flex items-center flex-grow"
                      }
                    >
                      <p className="w-96">{c.label}</p>
                      {phase === "Match" && index <= currentLineIndex ? (
                        c.code() ? (
                          <CheckCircle color="green" className="" />
                        ) : (
                          <XCircle color="red" className="" />
                        )
                      ) : null}
                    </div>
                  </div>
                ))}
                {rules[currentRuleIndex].action.map((c, index) => (
                  <div key={index} className="flex items-center flex-row">
                    <div className="bg-white w-5 mr-2 pr-2">
                      {phase === "Action" && index === currentLineIndex ? (
                        <ArrowRight className="" color="black" />
                      ) : null}
                    </div>
                    <div
                      className={
                        phase === "Action" && index <= currentLineIndex
                          ? "bg-green-200 h-10 p-4 flex items-center flex-grow"
                          : "bg-slate-200 h-10 p-4 flex items-center flex-grow"
                      }
                    >
                      <p className="w-96">{c.label}</p>
                      {phase === "Action" && index <= currentLineIndex ? (
                        <CheckCircle color="green" className="" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex my-4 justify-center h-full w-full items-center flex-grow">
            <Breadcrumbs phase={phase}></Breadcrumbs>
          </div>
          <div className="flex my-4 justify-center h-full w-full items-center flex-grow space-x-5">
            <Button onClick={handlePreviousStep}>Previous step</Button>
            <Button onClick={handleNextStep}>Next step</Button>
          </div>

          <div className="my-4">
            <h1 className="text-2xl">Production Rules</h1>
            <Accordion type="single" collapsible>
              {rules.map((rule, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex flex-row">
                      <div className="bg-white w-5 mr-2 pr-2">
                        {index === currentRuleIndex ? (
                          <ArrowBigRight className="" color="black" />
                        ) : null}
                      </div>
                      <p className="w-40 text-left ml-10">{rule.label} </p>
                      {matchedRules.includes(index) ? (
                        <div className="bg-green-100 rounded-xl px-2 ml-4 text-green-600">
                          Matched
                        </div>
                      ) : currentRuleIndex > index || phase !== "Match" ? (
                        <div className="bg-red-100 rounded-xl px-2 ml-4 text-red-600">
                          Not matched
                        </div>
                      ) : null}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {rule.condition.map((c, idx) => (
                      <p key={idx} className="ml-16">{c.label}</p>
                    ))}
                    {rule.action.map((a, idx) => (
                      <p key={idx} className="ml-16">{a.label}</p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}

// Header Component
const Header = () => {
  return (
    <header className="border-b-2 py-4 text-black text-center">
      <h1 className="text-2xl font-bold">Rule Based CTAT Viz</h1>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-300 py-2 text-center">
      <p>
        © {new Date().getFullYear()} Rule Based CTAT Viz. All rights reserved.
      </p>
    </footer>
  );
};
