import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.resolve(__dirname, "../../database/cantina.db");

const db = new Database(databasePath);

// Ativa a verificação das chaves estrangeiras
db.pragma("foreign_keys = ON");

export default db;