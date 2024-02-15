import { SkillsAccordion } from "./SkillsAccordion";

export default function SkillsBoard() {
  return (
    <div className="fixed z-50 right-10 top-44 w-[467px] h-auto bg-white_background p-5 rounded-lg flex flex-col gap-5">
      <h3 className="header text-2xl text-start">Your skills</h3>
      <SkillsAccordion title="Hard Skills" /* data */ />
      <SkillsAccordion title="Soft Skills" /* data */ />
    </div>
  );
}
