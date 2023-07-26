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

const rules = [
  {
    label: "findFirstPart",
    content: [
      "IF there is a goal to determine the square of N",
      "And N ends in 5",
      "And we have not split off the first part",
      "THEN",
      "Write Math.floor(N/10) as the first part",
    ],
  },
  {
    label: "addOne",
    content: [
      "IF there is a goal to determine the square of a number",
      "And we have split off the first part (call it F)",
      "And we have not added 1 to the first part",
      "THEN",
      "Write (F + 1) as the first part plus 1",
    ],
  },
  {
    label: "multiply",
    content: [
      "IF there is a goal to determine the square of a number",
      "And we have split off the first part (call it F1)",
      "And we have added 1 (call it F2)",
      "And we have not determined the product yet",
      "THEN",
      "Write (F1 * F2) as the product",
    ],
  },
  {
    label: "append25",
    content: [
      "IF there is a goal to determine the square of a number",
      "And we have figured out the product (call it P)",
      "And we have not appended 25 yet",
      "THEN",
      "Write (P * 100 + 25) as the final answer",
    ],
  },
];

export default function Home() {
  const [currentRule, setCurrentRule] = useState(rules[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleNextStep = () => {
    if (currentLineIndex < currentRule.content.length - 1) {
      setCurrentLineIndex((prevIndex) => prevIndex + 1);
    } else {
      const nextRuleIndex = rules.indexOf(currentRule) + 1;
      if (nextRuleIndex < rules.length) {
        setCurrentRule(rules[nextRuleIndex]);
        setCurrentLineIndex(0);
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
        setCurrentLineIndex(rules[prevRuleIndex].content.length - 1);
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
                <Input className="w-20" value={2}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">First part + 1:</p>{" "}
                <Input className="w-20" value={2}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">Product:</p>{" "}
                <Input className="w-20" value={2}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">Append:</p>{" "}
                <Input className="w-20" value={2}></Input>
              </div>
              <div className="flex flex-row items-center">
                <p className="w-32">Final Answer:</p>{" "}
                <Input className="w-20" value={2}></Input>
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
              {currentRule.content.map((line, index) => (
                <p
                  key={index}
                  className={index === currentLineIndex ? "bg-slate-200" : ""}
                >
                  {line}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>


        <div className="flex my-4 justify-center h-full w-full items-center flex-grow">
          <Breadcrumbs></Breadcrumbs>
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
                <AccordionTrigger>{rule.label}</AccordionTrigger>
                <AccordionContent>
                  {rule.content.map((line, idx) => (
                    <p key={idx}>{line}</p>
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
