"use server";
import prisma from "./prisma";
import { auth } from "../../auth";
import Errors, { BackendError, PublicError, zodOrThrow } from "./errors";
import { symbol, z } from "zod";
import { Prisma } from "@prisma/client";
import { shuffle } from "../utils";

type OrDesc<T extends string> = T | `${T}-desc`;

type Sorters = "question-type";

type StartAssessmentOptions = {
  /** @default "auto-seal" */
  mode?: "auto-seal" | "allow-multiple" | "fail-if-active";
  /**
   * Sort the questions (most to least important)
   * @example
   * // Sort by skill name in reverse, then sort by skill-type
   * ["skill-type", "skill-name-desc"]
   * @default []
   */
  sorters?: Array<OrDesc<Sorters>>;
};

const META = Symbol("meta");

/**
 * Starts an assessment, creates an assessment record.
 * @param options
 * @returns Created record
 */
export async function startAssessment(
  assessmentId: number,
  options?: StartAssessmentOptions
) {
  zodOrThrow(z.number().int().positive(), assessmentId);
  const { mode = "auto-seal", sorters = [] } = options ?? {};
  const session = await auth();
  if (!session?.user.id) throw Errors.InvalidSession();

  const userId = session.user.id;

  const assessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
    },
    include: {
      questions: true,
    },
  });
  if (!assessment) throw Errors.NotFound("Assessment");

  type Meta = {
    type: string;
  };

  const questions = assessment.questions.map(
    (v: any, i: any) =>
      ({
        questionId: v.id,
        index: i,
        [META]: {
          type: v.data.type,
        },
        // @ts-ignore
      } satisfies Prisma.QuestionRecordUncheckedCreateWithoutRecordInput & {
        [META]: Meta;
      })
  );

  shuffle(questions);

  for (let i = sorters.length - 1; i >= 0; i--) {
    const _sorter = sorters[i];
    const reverse = _sorter.endsWith("-desc");
    const sorter = (
      reverse ? _sorter.substring(0, _sorter.length - 5) : _sorter
    ) as Sorters;
    questions.sort((a: any, b: any) => {
      if (reverse) {
        [b, a] = [a, b];
      }
      switch (sorter) {
        case "question-type":
          return a[META].type.localeCompare(b[META].type);

        default:
          throw Errors.InvalidArgument("sorters");
      }
    });
  }

  for (let i = 0; i < questions.length; i++) {
    questions[i].index = i;
  }

  const createArgs = {
    data: {
      userId,
      assessmentId,
      questions: {
        create: assessment.questions.map((v: any, i: any) => ({
          questionId: v.id,
          index: i,
        })),
      },
    },
    include: {
      questions: {
        orderBy: {
          index: "asc",
        },
        include: {
          question: {
            select: {
              data: true,
              text: true,
            },
          },
        },
      },
    },
    // @ts-ignore
  } satisfies Prisma.AssessmentRecordCreateArgs;

  switch (mode) {
    default:
      throw Errors.InvalidArgument("mode");

    case "auto-seal": {
      const [updated, created] = await prisma.$transaction([
        prisma.assessmentRecord.updateMany({
          data: {
            sealed: true,
          },
          where: {
            userId,
            sealed: false,
          },
        }),
        prisma.assessmentRecord.create(createArgs),
      ]);
      return created;
    }

    case "allow-multiple": {
      return await prisma.assessmentRecord.create(createArgs);
    }

    case "fail-if-active": {
      const existing = await prisma.assessmentRecord.findFirst({
        where: {
          userId,
          sealed: false,
        },
      });

      if (existing)
        throw new PublicError(409, "You already have an active assessment");

      return await prisma.assessmentRecord.create(createArgs);
    }
  }
}

type AnswerType =
  | {
      type: "select";
      option: number;
    }
  | {
      type: "text";
      text: string;
    };

/**
 * Marks the question answered in a record.
 */
export async function answerQuestion(
  recordId: number,
  questionRecordId: number,
  answer: AnswerType
) {
  zodOrThrow(z.number().int().positive(), recordId);
  zodOrThrow(z.number().int().positive(), questionRecordId);
  const session = await auth();
  if (!session?.user.id) throw Errors.InvalidSession();

  const userId = session.user.id;

  let data: PrismaJson.QuestionRecordData;

  switch (answer.type) {
    default:
      throw Errors.InvalidArgument("answer.type");

    case "select":
      data = {
        type: answer.type,
        option: answer.option,
      };
      break;
    case "text":
      data = {
        type: answer.type,
        text: answer.text,
      };
      break;
  }

  const record = await prisma.assessmentRecord.findUnique({
    where: { id: recordId, userId },
  });
  if (!record) throw Errors.NotFound("Assessment");

  return await prisma.questionRecord.update({
    data: {
      sealed: true,
      data,
    },
    where: {
      id: questionRecordId,
    },
  });
}

/**
 * Seals a record of the current user.
 */
export async function sealRecord(recordId: number) {
  zodOrThrow(z.number().int().positive(), recordId);
  const session = await auth();
  if (!session?.user.id) throw Errors.InvalidSession();

  const userId = session.user.id;

  await prisma.assessmentRecord.update({
    data: {
      sealed: true,
    },
    where: {
      id: recordId,
      userId,
    },
  });
}

/**
 * Seals any active assessments the user has.
 * @returns Amount of items sealed
 */
export async function sealRecords() {
  const session = await auth();
  if (!session?.user.id) throw Errors.InvalidSession();

  const userId = session.user.id;

  return await prisma.assessmentRecord.updateMany({
    data: {
      sealed: true,
    },
    where: {
      userId,
      sealed: false,
    },
  });
}

export async function listActiveRecords() {
  const session = await auth();
  if (!session?.user.id) throw Errors.InvalidSession();

  const userId = session.user.id;

  return await prisma.assessmentRecord.findMany({
    where: {
      userId,
      sealed: false,
    },
  });
}

export async function getDetailedRecord(recordId: number) {
  zodOrThrow(z.number().int().positive(), recordId);
  const session = await auth();
  if (!session?.user.id) throw Errors.InvalidSession();

  const userId = session.user.id;

  return await prisma.assessmentRecord.findUniqueOrThrow({
    where: {
      id: recordId,
      userId,
    },
    include: {
      questions: {
        orderBy: {
          index: "asc",
        },
      },
    },
  });
}
