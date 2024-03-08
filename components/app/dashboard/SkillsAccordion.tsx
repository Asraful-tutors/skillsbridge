import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface SkillsAccordionProps {
  data: any;
  title: string;
  open?: boolean;
}

export function SkillsAccordion({ data, title, open }: SkillsAccordionProps) {
  return (
    data && (
      <Accordion
        type="single"
        collapsible
        defaultValue={open ? "item-1" : ""}
        className="w-full"
      >
        <AccordionItem value="item-1" className="w-full ">
          <AccordionTrigger className="w-full text-base rounded-md px-4 py-3 text-white bg-gradient-to-b from-[#B278FF] to-[#9D53FF]">
            {title}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 flex flex-col gap-5 bg-[#f6f2fb] max-h-[150px] overflow-y-scroll">
            {data?.map((skill: any, index: number) => (
              <div
                key={index}
                className="flex w-full justify-between items-center pr-4"
              >
                <h3 className="text-sm font-semibold text-[#000000]/[.50] !w-[400px]">
                  {skill?.skill?.name}
                </h3>{" "}
                {/* replace with skill.title variable */}
                <div className="flex flex-row items-center">
                  <Progress
                    value={Math.round(skill?.assessedScore)}
                    indicatorColor="bg-gradient-to-b from-[#B278FF] to-[#9D53FF]"
                    className="h-[10px] w-[80px] sm:w-[150px] bg-[#B59292]/[.51] mr-[21px]"
                  />
                  <h3 className="text-sm font-bold text-[#1C5FA1] w-[10px] text-end">
                    {skill?.assessedScore || 0}
                  </h3>{" "}
                  {/* replace with skill.value variables */}
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  );
}
