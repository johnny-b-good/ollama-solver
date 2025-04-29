import { z } from "zod";

const TaskVerdictSchema = z.object({
  status: z.enum([
    "ок",
    "not_enough_data",
    "no_calculations_needed",
    "impossible",
  ]),
  reason: z.string().min(1),
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
    throw new Error("Ошибка парсинга ответа модели");
  }
};
