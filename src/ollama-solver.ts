import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

import ollama from "ollama";

type TaskPrompt = {
  id: string;
  name: string;
  requirements: string;
  promptTemplate: (task: string) => string;
};

const solutionChoosingPrompt = (task: string, solutions: string) =>
  `Тебе поступила следующая задача от пользователя: "${task}". 
   Далее тебе поступит JSON с массивом объектов, описывающих возможные решения.
   Вот описание полей: id - идентефикатор решения, name - его название, 
   requirements - критерий, определяющий, насколько решение подходит задачи.
   Выбери решение, с высокой степенью подходящее поставленной задаче.
   Если такое решение найдено, выведи одним словом его id.
   Если ты не уверен ни в одном решении, выведи одним словом: impossible.
   Вот список решений в формате, описанном ранее: ${solutions}`;

const solutionPrompts: Array<TaskPrompt> = [
  {
    id: "datetime",
    name: "Задача на даты и время",
    requirements: `Можно ли решить задачу пользователя с помощью программы на Python с такими ограничениями:
       использование только стандартной библиотеки Python, 
       без запроса дополнительных данных от пользователя, 
       число строк кода предположительно менее тысячи.`,
    promptTemplate: (task: string) =>
      `Напиши программу на Python, решающий следующую задачу: "${task}". 
       Программа должна выводить только ответ на задачу. 
       Программа ни в коем случае не должна вредить компьютеру пользователя. 
       Необходимо использовать только стандартную библиотеку Python.
       Выведи только код программы, без дополнительных описаний и оформления.
       Выведенный текст программы должен быть готов к запуску.
       Важно: если выполнить задачу с указанными условиями невозможно, ответь одним словом: impossible`,
  },
];

const solutions: string = JSON.stringify(
  solutionPrompts.map((solution) => ({
    id: solution.id,
    name: solution.name,
    requirements: solution.requirements,
  })),
);

async function main() {
  const rl = readline.createInterface({ input, output });

  const message = await new Promise<string>((resolve) => {
    rl.question("Task:", (answer) => {
      resolve(answer);
    });
  });

  console.log("Choosing solution...");

  const response = await ollama.chat({
    model: "gemma3:12b",
    messages: [
      {
        role: "user",
        content: solutionChoosingPrompt(message, solutions),
      },
    ],
    stream: true,
  });

  for await (const part of response) {
    process.stdout.write(part.message.content);
  }
}

main().catch((err) => {
  console.error(err);
});
