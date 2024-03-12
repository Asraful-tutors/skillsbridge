import { Factory, NamedFactory, connect } from "./seed-util";
import questionsData from "./data/questions.json";
import mainSkillsData from "./data/main-skills.json";
import milestonesData from "./data/milestones.json";
// @ts-ignore
import { Difficulty } from "@prisma/client";

namespace SeedDB {
  export async function init() {
    await parseAssessmentsData();
    await parseMainSkillsData();
    await parseMilestoneData();
  }

  export const Milestones = NamedFactory.create("milestone", (name) => ({
    name,
    difficulty: "Beginner",
  }));
  export const Paths = NamedFactory.create("path", (name) => ({ name }));
  export const Assessments = NamedFactory.create("assessment", (name) => ({
    name,
  }));
  export const Skills = NamedFactory.create("skill", (name) => ({
    name,
    type: "Hard",
  }));

  export const Questions = Factory.create("question");
  export const MilestoneSkillRequirements = Factory.create(
    "milestoneSkillRequirement"
  );
}

async function parseAssessmentsData() {
  // Assessment name | Question | Answers | Points by skill...
  const data = questionsData;

  const headers = data[0];

  const assessments: Awaited<
    ReturnType<typeof SeedDB.Assessments.getCreate>
  >[] = [];

  let assessment: (typeof assessments)[0] = null as any;
  let question: Awaited<ReturnType<(typeof SeedDB.Questions)["create"]>> =
    null as any;
  let options: Extract<
    (typeof question)["data"],
    { type: "select" }
  >["options"] = null as any;
  let scores: { skillId: number; points: number }[] = null as any;

  // First line is skipped
  for (let i = 1; i < data.length; i++) {
    const line = data[i];

    for (let j = 0; j < line.length; j++) {
      const value = line[j];
      const header = headers[j];

      switch (j) {
        case 0: // Assessment name
          if (value) {
            assessment = await SeedDB.Assessments.getCreate(value);
          }
          break;
        case 1: // Question
          if (value) {
            options = [];
            question = await SeedDB.Questions.create({
              text: value,
              assessment: connect(assessment),
              data: {
                type: "select",
                options,
              },
            });
          }
          break;
        case 2: // Answers
          scores = [];
          switch (question.data.type) {
            case "select":
              options.push({
                text: value,
                points: scores,
              });
              SeedDB.Questions.update(question.id, {
                data: {
                  type: "select",
                  options,
                },
              });
              break;
          }
          break;
        default: // Points by skill...
          const skill = await SeedDB.Skills.getCreate(header);
          const points = Number(value) || 0;
          if (points) {
            scores.push({
              skillId: skill.id,
              points,
            });
          }
          break;
      }
    }
  }
}

async function parseMainSkillsData() {
  //   --   | Skill type...
  // Career | Skill names...
  const data = mainSkillsData;

  const headers = data[0];
  const types = data[1];

  let career: Awaited<ReturnType<typeof SeedDB.Paths.getCreate>> = null as any;

  // First two lines are skipped
  for (let i = 2; i < data.length; i++) {
    const line = data[i];

    for (let j = 0; j < line.length; j++) {
      const value = line[j];
      const type = types[j];

      switch (j) {
        case 0: // Career name
          career = await SeedDB.Paths.getCreate(value);
          break;
        default: // Skill names
          if (value) {
            let skill = await SeedDB.Skills.upsert(value, {
              name: value,
              type: type.toLowerCase() === "soft" ? "Soft" : "Hard",
            });
            await SeedDB.Paths.update(career.name, {
              skills: { connect: skill },
            });
          }
          break;
      }
    }
  }
}

async function parseMilestoneData() {
  // Career name | Title | Description | Difficulty Level | Link | Assessments | Skill requirements...

  const data = milestonesData;

  const headers = data[0];

  // First line is skipped
  for (let i = 1; i < data.length; i++) {
    const line = data[i];

    const [
      careerNamesRaw,
      title,
      description,
      difficulty,
      link,
      assessmentCsv,
      ...skillRequirements
    ] = line;

    const careerNames = careerNamesRaw.split(/,\ ?/)

    const careers = await SeedDB.Paths.getCreateMulti(...careerNames);

    const assessmentNames = assessmentCsv.split(/,\ ?/);
    const assessments = await SeedDB.Assessments.getCreateMulti(
      ...assessmentNames.map((v) => ({
        name: v,
      }))
    );

    const milestone = await SeedDB.Milestones.getCreate(title, {
      name: title,
      description,
      link,
      paths: connect(careers),
      difficulty: difficulty as Difficulty,
      assessments: connect(assessments),
    });

    const filteredReqs = await Promise.all(
      skillRequirements
        .map((v, i) => ({
          score: Number(v) || 0,
          skillName: headers[6 + i],
        }))
        .filter((v) => v.score)
        .map(async (v) => ({
          score: v.score,
          skill: await SeedDB.Skills.getCreate(v.skillName),
        }))
    );

    const requirements = await SeedDB.MilestoneSkillRequirements.createMulti(
      ...filteredReqs.map((v) => ({
        milestone: connect(milestone),
        skill: connect(v.skill),
        score: v.score,
      }))
    );
  }
}

export default SeedDB;
