import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

import ollama from "ollama";

async function main() {
  const rl = readline.createInterface({ input, output });

  const message = await new Promise<string>((resolve) => {
    rl.question("What is your name? ", (answer) => {
      resolve(answer);
    });
  });

  console.log("Thinking...");

  const response = await ollama.chat({
    model: "gemma3:12b",
    messages: [{ role: "user", content: message }],
    stream: true,
  });

  for await (const part of response) {
    process.stdout.write(part.message.content);
  }
}

main().catch((err) => {
  console.error(err);
});
