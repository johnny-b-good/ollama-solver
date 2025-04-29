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

async function main() {
  const rl = readline.createInterface({ input, output });

  const task = await new Promise<string>((resolve) => {
    rl.question("Task:", (answer) => {
      resolve(answer);
    });
  });

  const taskResponse = await runRequest({
    prompt: solutionChoosingPrompt(task),
    model: MODEL,
  });

  let taskVerdict = await parseTaskResponse(taskResponse.message.content);

  if (taskVerdict.status !== "ок") {
    console.log(taskVerdict.reason);
    process.exit(0);
  }

  const programResponse = await runRequest({
    prompt: programWritingPrompt(task),
    model: MODEL,
  });

  let pythonScriptResult = await saveAndRunPythonScript(
    programResponse.message.content,
  );

  const finalResponse = await runRequest({
    prompt: resultReportingPrompt(task, pythonScriptResult),
    model: MODEL,
  });

  console.log(finalResponse.message.content);
}

main().catch((err) => {
  console.error(err);
});
