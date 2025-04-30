import { z } from "zod";

const TaskVerdictSchema = z.object({
  task: z.string().min(1),
  status: z.enum([
    "ok",
    "not_enough_data",
    "no_calculations_needed",
    "impossible",
  ]),
  message: z.string().min(1),
});

export type TaskVerdict = z.infer<typeof TaskVerdictSchema>;

export const parseTaskResponse = async (
  taskResponse: string,
): Promise<TaskVerdict> => {
  try {
    const responseWithoutWrapper = taskResponse
      .replace("```json", "")
      .replace("```", "")
      .trim();

    const parsedResponse = JSON.parse(responseWithoutWrapper);

    return TaskVerdictSchema.parse(parsedResponse);
  } catch (err) {
    console.error(err);
    throw new Error("Model response pasing error");
  }
};
