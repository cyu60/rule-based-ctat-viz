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
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [firstPart, setFirstPart] = useState<number>();
  const [firstPartPlusOne, setFirstPartPlusOne] = useState<number>();
  const [product, setProduct] = useState<number>();
  const [N, setN] = useState(25);
  const [final, setFinal] = useState<number>();

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
          code: () => firstPart === undefined,
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
          code: () => firstPart !== undefined,
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
          code: () => setFinal(product! * 100 + 25),
        },
      ],
    },
  ];

  const [currentRule, setCurrentRule] = useState(rules[0]);
  const [matchedRules, setMatchedRules] = useState<string[]>([]);
  type PhaseEnum = "Match" | "Conflict resolution" | "Action";
  const [phase, setPhase] = useState<PhaseEnum>("Match");

  const moveToNextPhase = () => {
    if (phase === "Match") {
      setPhase("Conflict resolution");
      // TODO: This doesn't seem to work...
      setCurrentRule(rules[0]);

      setCurrentLineIndex(0);
      // moveToNextPhase();
    } else if (phase === "Conflict resolution") {
      setPhase("Action");
      // identify matched rules
      const fullMatchedRules = matchedRules.map((matchedRule) =>
        rules.find((rule) => rule.label === matchedRule)
      );

      // update to current rule -- this does not happen until update of state...
      // Expect there to be 1 rule, 1 match
      setCurrentRule(fullMatchedRules[0]!);
      setCurrentLineIndex(0);
    } else if (phase === "Action") {
      setPhase("Match");
      setMatchedRules([]);
      setCurrentLineIndex(0);
    }
  };

  const moveToNextRule = () => {
    // Find the next rule based on matching labels for the rules
    const nextRuleIndex =
      rules.findIndex((rule) => rule.label === currentRule.label) + 1;
    if (nextRuleIndex < rules.length) {
      setCurrentLineIndex(0);
      setCurrentRule(rules[nextRuleIndex]);
    } else {
      // Move to the next phase
      moveToNextPhase();
    }
  };

  const handleNextStep = () => {
    // execute step based on phase?
    console.log(
      "Phase",
      phase,
      " Current Line",
      currentLineIndex,
      "Current Rule",
      currentRule
    );

    if (phase === "Match") {
      if (currentLineIndex < currentRule.condition.length - 1) {

        console.log(firstPart)

        // const newIndex = currentLineIndex + 1;
        // Check if the current line is true
        // otherwise move to next rule
        currentRule.condition[currentLineIndex].code()
          ? setCurrentLineIndex((prevIndex) => prevIndex + 1)
          : moveToNextRule();
      } else {
        // Add to list of matched rules
        // Need to check for next one as well
        currentRule.condition[currentLineIndex].code() &&
          setMatchedRules([...matchedRules, currentRule.label]);

        // Move to next rule function
        moveToNextRule();
      }
    }
    if (phase === "Conflict resolution") {
      // TODO: This doesn't seem to work...
      // setCurrentRule(rules[0]);

      // setCurrentLineIndex(0);
      moveToNextPhase();
    }
    if (phase === "Action") {
      // TODO: Patch this -- ensure that there should only be 1 update for everything!

      // execute on matched rule
      if (currentLineIndex < currentRule.action.length - 1) {
        // Execute the current line index -- Need to add 1 to be hacky
        currentRule.action[currentLineIndex + 1].code();
        console.log(
          "executing: " +
            currentRule.action[currentLineIndex + 1].code.toString()
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
      const prevRuleIndex = rules.indexOf(currentRule) - 1;
      if (prevRuleIndex >= 0) {
        setCurrentRule(rules[prevRuleIndex]);
        setCurrentLineIndex(rules[prevRuleIndex].condition.length - 1);
        // setCurrentLineIndex(rules[prevRuleIndex].content.length - 1);
      }
    }
  };
  return (
    <main className="flex p-24 justify-center h-full items-center w-full space-y-5">
      <div className="flex flex-col sm:w-3/4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* First Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>ITS State</CardTitle>
              <CardDescription>Tracks the state of the ITS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-bold">Find the square of 25</p>
              <div className="flex flex-row items-center">
                <p className="w-32">First part:</p>{" "}
                <Input className="w-20" value={firstPart || ""}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">First part + 1:</p>{" "}
                <Input className="w-20" value={firstPartPlusOne || ""}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">Product:</p>{" "}
                <Input className="w-20" value={product || ""}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">Append:</p>{" "}
                <Input className="w-20" value={N || ""}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">Final Answer:</p>{" "}
                <Input className="w-20" value={final || ""}></Input>
              </div>
            </CardContent>
          </Card>

          {/* Second Card */}
          <Card className="">
            <CardHeader>
              <CardTitle>Program tracing</CardTitle>
              <CardDescription>Trace the program line</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-bold">{currentRule.label}</p>
              {currentRule.condition.map((c, index) => (
                <p
                  key={index}
                  className={
                    phase === "Match" && index === currentLineIndex
                      ? c.code()
                        ? "bg-green-200"
                        : "bg-red-200"
                      : "bg-indigo-200"
                  }
                >
                  {c.label}
                </p>
              ))}
              {currentRule.action.map((c, index) => (
                <p
                  key={index}
                  className={
                    phase === "Action" && index === currentLineIndex
                      ? "bg-green-200"
                      : "bg-slate-200"
                  }
                >
                  {c.label}
                </p>
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
          <h1 className="text-2xl">Rules</h1>
          <Accordion type="single" collapsible>
            {rules.map((rule, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <div>
                    {rule.label}{" "}
                    {matchedRules.includes(rule.label) ? (
                      <div className="bg-green-300 rounded-xl">Matched</div>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {rule.condition.map((c, idx) => (
                    <p key={idx}>{c.label}</p>
                  ))}
                  {rule.action.map((a, idx) => (
                    <p key={idx}>{a.label}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
}
