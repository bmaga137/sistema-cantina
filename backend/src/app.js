import express from "express";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { authorizeMiddleware } from "./middlewares/authorizeMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "production") {
  const frontend = fileURLToPath(new URL("../../frontend/dist/", import.meta.url));
  app.use(express.static(frontend));
}

app.get("/", (req, res) => {
    res.json({
        message: "API do CantinaFácil funcionando!"
    });
});

app.get("/api/auth/perfil", authMiddleware, (req, res) => {
  res.json({
    message: "Autenticação realizada com sucesso!",
    usuario: req.usuario
  });
});

app.get(
  "/api/admin/teste",
  authMiddleware,
  authorizeMiddleware("administrador"),
  (req, res) => {
    res.json({
      message: "Acesso administrativo autorizado!",
      usuario: req.usuario
    });
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/produtos", productRoutes);
app.use("/api/orders", orderRoutes);
export default app;
