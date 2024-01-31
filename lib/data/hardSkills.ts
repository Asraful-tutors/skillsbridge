export type HardSkill = {
  img: string;
  title: string;
  language: string[];
  scale: {
    values: number[];
    selected: number;
  };
};

export const hardSkills: HardSkill[] = [
  {
    img: "/images/game-designer.svg",
    title: "Coding language",
    language: ["C#", "C++", "Java Script"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
  {
    img: "/images/game-designer.svg",
    title: "Game Engine",
    language: ["Unity", "Unreal Engine"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
  {
    img: "/images/game-designer.svg",
    title: "Networking Principle",
    language: ["C#", "C++", "Java Script"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
  {
    img: "/images/game-designer.svg",
    title: "Graphics Rendering",
    language: ["C#", "C++", "Java Script"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
];
