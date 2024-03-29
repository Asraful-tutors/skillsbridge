declare namespace PrismaJson {
  type QuestionData =
    | {
        type: "select";
        options: Array<
          {
            text: string;
          } & (
            | {
                correct: boolean;
              }
            | {
                points: {
                  /** Skill id is not part of data integrity. It can point to a deleted skill. */
                  skillId: number;
                  points: number;
                }[];
              }
          )
        >;
      }
    | {
        type: "text";
      };

  type QuestionRecordData =
    | {
        type: "select";
        option: number;
      }
    | {
        type: "text";
        text: string;
      };
}
