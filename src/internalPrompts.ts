export const solutionChoosingPrompt = (task: string) =>
  `
  You have received the following task from the user: "${task}".\n
  Can the user's task be solved using a Python program with the following limitations:\n
  ${taskRequirements}\n
  Output a JSON object with three fields: "task", "status", "message".\n
  Do not add any additional formatting or descriptions to the JSON output; it should be ready for parsing.\n
  The "task" field should contain user's task translated to English if needed.\n
  The "status" field can have the following values:\n
  "ok" - if you are confident that you can perform the task with full compliance with all limitations,\n
  "not_enough_data" - if you lack the necessary known data to solve the task and it cannot be calculated with Python,\n
  "no_calculations_needed" - if you can confidently answer the user's question without additional Python calculations,\n
  "impossible" - if you are confident that the task cannot be completed following all limitations.\n
  Output the justification for your decision in the "message" field. Keep it short and to the point.\n
  Language of the text in the "message" field should be the same as in user's task.\n
  `.trim();

export const programWritingPrompt = (task: string) =>
  `
  Write a Python program to solve the following task: "${task}".\n
  The program must adhere to the following restrictions:\n
  ${taskRequirements}\n
  Output only the program code, without additional descriptions or formatting.\n
  The outputted program text should be ready to run.\n
  `.trim();

export const resultReportingPrompt = (task: string, result: string) =>
  `
  The user gave you the following task: "${task}".\n
  Through additional calculations, you've obtained the following information: "${result}".\n
  Formulate a detailed answer to the user's request, using this data.\n
  The language of answer should be the same as in user's task.\n
  `.trim();

const taskRequirements = `
  * It is allowed to use the standard Python library and data to which it provides access.\n
  * Third-party Python libraries are strictly prohibited.\n
  * Strictly prohibited to request additional data input from the user.\n
  * You can calculate additional data with Python.
  * The program must not harm the user, their computer, or their data under any circumstances.\n
  * The program should output the result of interest to the user with a detailed expanation.\n
  * The language of program output should be the same as in user's task.
  * The number of code lines should be reasonably small.\n
  * The program execution time be reasonably small.\n
  `.trim();
