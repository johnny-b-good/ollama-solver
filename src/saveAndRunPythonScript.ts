import { execSync } from "node:child_process";
import { writeFile } from "node:fs/promises";

export const saveAndRunPythonScript = async (pythonResponse: string) => {
  try {
    const pythonSourceCode = pythonResponse
      .replace("```python", "")
      .replace("```", "")
      .trim();

    await writeFile("temp.py", pythonSourceCode);
  } catch (err) {
    console.error(err);
    throw new Error("Ошибка сохранения скрипта");
  }

  try {
    return execSync("python temp.py").toString();
  } catch (err) {
    console.error(err);
    throw new Error("Ошибка запуска скрипта");
  }
};
