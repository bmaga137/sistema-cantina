import "dotenv/config";
import { createClient } from "@libsql/client";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
const databasePath = volumePath
  ? path.join(volumePath, "cantina.db")
  : path.resolve(__dirname, "../../database/cantina.db");

const urlRemota = process.env.TURSO_DATABASE_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (Boolean(urlRemota) !== Boolean(authToken) || (process.env.RENDER === "true" && !urlRemota)) {
  throw new Error("Configure TURSO_DATABASE_URL e TURSO_AUTH_TOKEN para usar o banco remoto.");
}

const db = createClient({ url: urlRemota || pathToFileURL(databasePath).href, authToken });

export function executar(sql, args = []) {
  return db.execute({ sql, args });
}

export async function consultar(sql, args = []) {
  return (await executar(sql, args)).rows;
}

export async function buscar(sql, args = []) {
  return (await consultar(sql, args))[0];
}

export default db;
