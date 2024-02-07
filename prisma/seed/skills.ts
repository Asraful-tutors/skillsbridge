import { Prisma, PrismaClient } from "@prisma/client"
import { ModelFactory, ezConnect } from "./seed-util"
import { readFileSync } from 'fs';
import { join } from "path";
import { Paths } from "./paths";

const skillFactory = new class extends ModelFactory<Prisma.SkillCreateInput> { }
const skillQuestionFactory = new class extends ModelFactory<Prisma.SkillQuestionCreateInput> { }

const selectQuestions = readFileSync(join(__dirname, 'skill-assesment-questions-select.tsv'), 'utf8');
const textQuestions = readFileSync(join(__dirname, 'skill-assesment-questions-text.tsv'), 'utf8');

function parseSelectQuestions(input: string, mode: "select" | "text") {
  let results = [] as ReturnType<typeof skillQuestionFactory['create']>[];
  let line = "";
  let value = "";
  let values = ['', '', '', '', ''] as string[]
  let tabIndex = 0

  let skill = ''
  let text = ''
  let options = [] as { text: string, correct: boolean }[]

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    switch (char) {
      case '\t':
        if (value && tabIndex <= 2 && values[tabIndex]) { // New question
          const matchingSkill = Object.values(Skills).find(v => v.name === skill);
          if (!matchingSkill) {
            console.warn(`Cannot find skill "${skill}"`);
          } else {
            switch (mode) {
              case "select":
                results.push(skillQuestionFactory.create({
                  level: 5,
                  skill: ezConnect(matchingSkill),
                  type: "select",
                  options: {
                    create: options
                  },
                  text,
                }))
                break;
              case "text":
                results.push(skillQuestionFactory.create({
                  level: 5,
                  skill: ezConnect(matchingSkill),
                  type: "text",
                  text,
                }))
                break;
            }
          }
          options.length = 0;
        }
        values[tabIndex] = value ? value : values[tabIndex]
        value = "";
        tabIndex++;
        break;
      case '\n':
      case '\r':

        if (!line) continue;

        values[tabIndex] = value || tabIndex >= 4 ? value : values[tabIndex]

        const [v0, v1, v2, option, correct] = values
        skill = v1.trim()
        text = v2.trim()

        options.push({
          text: option,
          correct: !!correct,
        })

        line = "";
        value = "";
        tabIndex = 0;
        break;
      default:
        line += char;
        value += char;
        break;
    }
  }
  return results;
}

export const Skills = {
  DigitalPaintingAndDrawing: skillFactory.create({
    name: "Digital Painting and Drawing",
    paths: ezConnect(Paths.Artist),
    type: "hard",
  }),
  ModelingandAnimation: skillFactory.create({
    name: "3D Modeling and Animation",
    paths: ezConnect(Paths.Artist),
    type: "hard",
  }),
  Texturing: skillFactory.create({
    name: "Texturing",
    paths: ezConnect(Paths.Artist),
    type: "hard",
  }),
  Sculpting: skillFactory.create({
    name: "Sculpting",
    paths: ezConnect(Paths.Artist),
    type: "hard",
  }),
  KnowledgeOfGameEngines: skillFactory.create({
    name: "Knowledge of Game Engines",
    paths: ezConnect(Paths.Artist),
    type: "hard",
  }),

  GameMechanics: skillFactory.create({
    name: "Game Mechanics",
    paths: ezConnect(Paths.GameDesign),
    type: "hard",
  }),
  LevelDesign: skillFactory.create({
    name: "Level Design",
    paths: ezConnect(Paths.GameDesign),
    type: "hard",
  }),
  NarrativeDesign: skillFactory.create({
    name: "Narrative Design",
    paths: ezConnect(Paths.GameDesign),
    type: "hard",
  }),
  Playtesting: skillFactory.create({
    name: "Playtesting",
    paths: ezConnect(Paths.GameDesign),
    type: "hard",
  }),

  ProjectManagementTools: skillFactory.create({
    name: "Project Management Tools",
    paths: ezConnect(Paths.Producer),
    type: "hard",
  }),
  BudgetingAndFinancialSoftware: skillFactory.create({
    name: "Budgeting and Financial Software",
    paths: ezConnect(Paths.Producer),
    type: "hard",
  }),
  SchedulingTools: skillFactory.create({
    name: "Scheduling Tools",
    paths: ezConnect(Paths.Producer),
    type: "hard",
  }),
  AgileAndScrumMethodologies: skillFactory.create({
    name: "Agile and Scrum Methodologies",
    paths: ezConnect(Paths.Producer),
    type: "hard",
  }),

  ProgrammingLanguages: skillFactory.create({
    name: "Programming Languages",
    paths: ezConnect(Paths.GameProgrammer),
    type: "hard",
  }),
  GameEngines: skillFactory.create({
    name: "Game Engines",
    paths: ezConnect(Paths.GameProgrammer),
    type: "hard",
  }),
  GraphicsProgramming: skillFactory.create({
    name: "Graphics Programming",
    paths: ezConnect(Paths.GameProgrammer),
    type: "hard",
  }),
  ArtificialIntelligence: skillFactory.create({
    name: "Artificial Intelligence",
    paths: ezConnect(Paths.GameProgrammer),
    type: "hard",
  }),
  NetworkProgramming: skillFactory.create({
    name: "Network Programming",
    paths: ezConnect(Paths.GameProgrammer),
    type: "hard",
  }),

  CriticalAndCreativeThinking: skillFactory.create({
    name: "Critical & Creative Thinking",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  IndependentLearning: skillFactory.create({
    name: "Independent Learning",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  IndustryTrends: skillFactory.create({
    name: "Industry Trends",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  Networking: skillFactory.create({
    name: "Networking",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  PersonalResponsibility: skillFactory.create({
    name: "Personal Responsibility",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  Teamwork: skillFactory.create({
    name: "Teamwork",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  CommunicationSkills: skillFactory.create({
    name: "Communication Skills",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  TimeManagement: skillFactory.create({
    name: "Time Management",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
  ConflictResolution: skillFactory.create({
    name: "Conflict Resolution",
    paths: ezConnect(Paths.SoftSkills),
    type: "soft",
  }),
} as const

export const SelectQuestions = parseSelectQuestions(selectQuestions, "select")
export const TextQuestions = parseSelectQuestions(textQuestions, "text")
