import ollama from "ollama";

export const runRequest = async ({
  prompt,
  model,
}: {
  prompt: string;
  model: string;
}) => {
  return await ollama.chat({
    model,
    messages: [{ role: "user", content: prompt }],
    stream: false,
  });
};
