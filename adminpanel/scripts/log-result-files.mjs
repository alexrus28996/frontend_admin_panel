import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

const resultFiles = [
  "result_prompt_02_dashboard.md",
  "result_prompt_03_users.md",
  "result_prompt_ui_world_class.md",
];

for (const fileName of resultFiles) {
  const filePath = path.join(projectRoot, fileName);

  if (existsSync(filePath)) {
    console.log("RESULT FILE CREATED:", filePath);
  }
}
