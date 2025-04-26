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
   Ты не в коем случае не должен запрашивать дополнительные данные от пользователя.
   Задача пользователем поставлена полностью.
   Нельзя предпологать известность фактов вне описания задачи.
   
   Если такое решение найдено, выведи одним словом его id.
   Если тебе не хвает известных данных, выведи одним словом: not_enough_data.
   Если ты не достаточно уверен в пригодности ни одного решения, выведи одним словом: impossible.

   Выведи обоснование своего решения.
   
   Вот список решений в формате, описанном ранее: ${solutions}`;

const solutionPrompts: Array<TaskPrompt> = [
  {
    id: "datetime",
    name: "Задача на даты и время",
    requirements: `Можно ли решить задачу пользователя с помощью программы на Python с такими ограничениями.
       Разрешено использование только стандартной библиотеки Python. 
       Запрещены запросы дополнительных данных от пользователя, из интернета или файловой системы.
       Поставленная задача должна содержать все необходимые данные для её решения.
       Число строк кода предположительно менее тысячи.
       Время выполнения программы предположительно меньше 10 секунд.`,
    promptTemplate: (task: string) =>
      `Напиши программу на Python, решающий следующую задачу: "${task}". 
       Программа не должна требовать дополнительного ввода от пользователя, запросы к сети или файловой системе.
       Программа ни в коем случае не должна вредить компьютеру пользователя. 
       Программа должна выводить только ответ на задачу. 
       Необходимо использовать только стандартную библиотеку Python.
       Выведи только код программы, без дополнительных описаний и оформления.
       Выведенный текст программы должен быть готов к запуску.
       Важно: если выполнить задачу с максимальным соответствием указанным условиям невозможно, 
       ответь одним словом: impossible`,
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
  // const rl = readline.createInterface({ input, output });

  // const message = await new Promise<string>((resolve) => {
  //   rl.question("Task:", (answer) => {
  //     resolve(answer);
  //   });
  // });

  // const message = "Через сколько дней настанет мой день рождения?";
  // const message = "Как зовут мою кошку?";
  const message = "Как пройти в ближайшую библиотеку";

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
