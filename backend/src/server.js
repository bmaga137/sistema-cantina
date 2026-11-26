import "dotenv/config";

import app from "./app.js";
import { initDatabase } from "./config/initDatabase.js";

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET?.trim()) {
  throw new Error("Configure JWT_SECRET antes de iniciar o servidor.");
}

await initDatabase();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
