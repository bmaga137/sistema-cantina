import app from "./app.js";
import "./config/initDatabase.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});