import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function TechnicalSkills() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1" className="w-full">
        <AccordionTrigger className="w-full bg-[#9849FF] rounded-md px-4 py-3 text-white">
          Technical skills
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3 flex flex-col gap-5 bg-[#f6f2fb]">
          <div className="text-sm font-semibold text-[#00000080]">
            Unreal Engine
          </div>
          <div className="text-sm font-semibold text-[#00000080]">Maya</div>
          <div className="text-sm font-semibold text-[#00000080]">
            Blender 3D
          </div>
          <div className="text-sm font-semibold text-[#00000080]">Unity</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
