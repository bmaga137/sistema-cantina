import { Router } from "express";

import {
  listProducts,
  listActiveProducts,
  registerProduct,
  editProduct,
  deleteProduct
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware.js";

const router = Router();

// Catálogo público
router.get("/", listProducts);
router.get("/admin", authMiddleware, authorizeMiddleware("administrador"), listActiveProducts);

// Cadastro restrito a administradores
router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("administrador"),
  registerProduct
);

router.put(
  "/:id",
  authMiddleware,
  authorizeMiddleware("administrador"),
  editProduct
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeMiddleware("administrador"),
  deleteProduct
);

export default router;
