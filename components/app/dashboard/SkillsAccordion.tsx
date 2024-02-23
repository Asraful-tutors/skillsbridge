import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface SkillsAccordionProps {
  /* data */
  title: string,
}

export function SkillsAccordion({
  title,
}: SkillsAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="w-full">
        <AccordionTrigger className="w-full text-base rounded-md px-4 py-3 text-white bg-gradient-to-b from-[#B278FF] to-[#9D53FF]">
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3 flex flex-col gap-5 bg-[#f6f2fb]">
          {/* {data.map((skill, index) => ( */}
            <div /* key={index} */ className="flex flex-row justify-between items-center">
              <h3 className="text-sm font-semibold text-[#000000]/[.50]">Unreal engine</h3> {/* replace with skill.title variable */}
              <div className="flex flex-row items-center">
                <Progress value={33} indicatorColor="bg-gradient-to-b from-[#B278FF] to-[#9D53FF]" className="h-[10px] w-[100px] sm:w-[207px] bg-[#B59292]/[.51] mr-[21px]" />
                <h3 className="text-sm font-bold text-[#1C5FA1]">{50}%</h3> {/* replace with skill.value variables */}
              </div>
            </div>
          {/* ))} */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
