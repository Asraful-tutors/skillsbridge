export type SoftSkills = {
  img: string;
  title: string;
  language: string[];
  scale: {
    values: number[];
    selected: number;
  };
};

export const softSkills: SoftSkills[] = [
  {
    img: "/images/game-designer.svg",
    title: "Analytical Skills",
    language: ["C#", "C++", "Java Script"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
  {
    img: "/images/game-designer.svg",
    title: "Adaptability",
    language: ["Unity", "Unreal Engine"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
  {
    img: "/images/game-designer.svg",
    title: "Problem Solving",
    language: ["C#", "C++", "Java Script"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
  {
    img: "/images/game-designer.svg",
    title: "Critical Thinking",
    language: ["C#", "C++", "Java Script"],
    scale: {
      values: [1, 2, 3, 4],
      selected: 1,
    },
  },
];
