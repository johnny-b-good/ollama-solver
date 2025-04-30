import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

import {
  programWritingPrompt,
  resultReportingPrompt,
  solutionChoosingPrompt,
} from "./internalPrompts";
import { runRequest } from "./runRequest";
import { parseTaskResponse } from "./parseTaskResponse";
import { saveAndRunPythonScript } from "./saveAndRunPythonScript";

const MODEL = "gemma3:12b";
const CODING_MODEL = "gemma3:12b";

async function main() {
  const rl = readline.createInterface({ input, output });

  const task = await new Promise<string>((resolve) => {
    rl.question("Task:", (answer) => {
      resolve(answer);
    });
  });

  console.log("Thinking about the task...");

  const taskResponse = await runRequest({
    prompt: solutionChoosingPrompt(task),
    model: MODEL,
  });

  let taskVerdict = await parseTaskResponse(taskResponse.message.content);

  if (taskVerdict.status !== "ok") {
    console.log(taskVerdict);
    process.exit(0);
  }

  console.log("Creating helper...");

  const programResponse = await runRequest({
    prompt: programWritingPrompt(taskVerdict.task),
    model: CODING_MODEL,
  });

  console.log("Running helper...");

  let pythonScriptResult = await saveAndRunPythonScript(
    programResponse.message.content,
  );

  console.log("Thinking about the result...");

  const finalResponse = await runRequest({
    prompt: resultReportingPrompt(task, pythonScriptResult),
    model: MODEL,
  });

  console.log(finalResponse.message.content);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
});
