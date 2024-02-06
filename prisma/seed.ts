import { PrismaClient, Prisma } from '@prisma/client'
import { create } from 'domain'

const prisma = new PrismaClient()


async function main() {

  console.log(`Start seeding ...`)

  const joe = await prisma.user.create({
    data:
    {
      name: "joeForFun42",
      email: "joe@usa.org",
      image: "https://i.insider.com/5604a559bd86ef19008bcea3?width=700&height=700&format=jpeg",
      profile: {
        create: {
          firstname: "Joe",
          lastname: "Mama",
          bio: "Hi, I'm Joe Mama. You might know me from my day job, but what really brings me joy is ice cream. It's not just a treat; it's a way to connect, to share a moment of sweetness in a complex world. Whether I'm in the Oval Office or out meeting folks, I always find time for a scoop (or two). Vanilla? That's my go-to. Simple, classic, but ready to mix with any flavor life throws my way. Serving the people, scooping up ice cream—it's all about bringing a bit of happiness. And remember, every cone served comes with a smile. Stay cool, my friends.",
        }
      }
    }
  })


  // Hard
  const programming = await prisma.skill.create({
    data: {
      name: "Coding Language",
      type: "hard",
    }
  });
  const JS = await prisma.subSkill.create({ data: { name: "JavaScript", type: programming.type, parentId: programming.id } });
  const CPP = await prisma.subSkill.create({ data: { name: "C++", type: programming.type, parentId: programming.id } });
  const CS = await prisma.subSkill.create({ data: { name: "C#", type: programming.type, parentId: programming.id } });

  const gameEngine = await prisma.skill.create({
    data: {
      name: "Game Engine",
      type: "hard"
    }
  });
  const unity = await prisma.subSkill.create({ data: { name: "Unity", type: gameEngine.type, parentId: gameEngine.id } });
  const unreal = await prisma.subSkill.create({ data: { name: "Unreal Engine", type: gameEngine.type, parentId: gameEngine.id } });

  const networking = await prisma.skill.create({
    data: {
      name: "Networking Principle",
      type: "hard"
    }
  });

  const graphics = await prisma.skill.create({
    data: {
      name: "Graphics Rendering",
      type: "hard"
    }
  });

  // Soft
  const analytical = await prisma.skill.create({
    data: {
      name: "Analytical Skills",
      type: "soft"
    }
  });
  const adapt = await prisma.skill.create({
    data: {
      name: "Adaptability",
      type: "soft"
    }
  });
  const problem = await prisma.skill.create({
    data: {
      name: "Problem Solving",
      type: "soft"
    }
  });
  const critical = await prisma.skill.create({
    data: {
      name: "Critical Thinking",
      type: "soft"
    }
  });


  const pathData: Prisma.PathCreateInput[] = [
    {
      icon: "icon",
      name: "Test Path",
      milestones: {
        create: [
          {
            name: "Basic coding for game development",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
            skills: {
              connect: [
                adapt,
                problem,
                critical,
                analytical,
              ]
            },
            assessments: {
              create: [
                {
                  questions: {
                    create: [
                      {
                        text: "Question 1",
                        type: "select",
                        options: {
                          create: [
                            {
                              text: "Q 1 Correct answer 1",
                              correct: true,
                            }, {
                              text: "Q 1 Wrong answer 2",
                            }, {
                              text: "Q 1 Wrong answer 3",
                            }
                          ]
                        }
                      },
                      {
                        text: "Question 2",
                        type: "select",
                        options: {
                          create: [
                            {
                              text: "Q 2 Correct answer 1",
                              correct: true,
                            }, {
                              text: "Q 2 Wrong answer 2",
                            }, {
                              text: "Q 2 Wrong answer 3",
                            }
                          ]
                        }
                      },
                    ]
                  }
                }
              ]
            }
          },
          {
            name: "JavaScript Algorithms and Data Structures",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
            skills: {
              connect: [
                adapt,
                problem,
                critical,
                analytical,
              ]
            },
            skillRequirements: {
              create: [{
                skillId: programming.id,
                score: 5,
              }, {
                skillId: analytical.id,
                score: 3,
              }, {
                skillId: graphics.id,
                score: 1,
              }]
            },
            assessments: {
              create: [
                {
                  questions: {
                    create: [
                      {
                        text: "Question 1",
                        type: "select",
                        options: {
                          create: [
                            {
                              text: "Q 1 Correct answer 1",
                              correct: true,
                            }, {
                              text: "Q 1 Wrong answer 2",
                            }, {
                              text: "Q 1 Wrong answer 3",
                            }
                          ]
                        }
                      },
                      {
                        text: "Question 2",
                        type: "select",
                        options: {
                          create: [
                            {
                              text: "Q 2 Correct answer 1",
                              correct: true,
                            }, {
                              text: "Q 2 Wrong answer 2",
                            }, {
                              text: "Q 2 Wrong answer 3",
                            }
                          ]
                        }
                      },
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
  ]

  for (const data of pathData) {
    await prisma.path.create({ data })
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
