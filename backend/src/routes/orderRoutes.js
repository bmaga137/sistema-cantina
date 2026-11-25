import { Router } from "express";
import { registerOrder, listOrders, showOrder, changeOrderStatus } from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware.js";

const router = Router();
const canReadOrders = authorizeMiddleware("cliente", "administrador");

router.use(authMiddleware);
router.post("/", authorizeMiddleware("cliente"), registerOrder);
router.get("/", canReadOrders, listOrders);
router.get("/:id", canReadOrders, showOrder);
router.patch("/:id/status", authorizeMiddleware("administrador"), changeOrderStatus);

export default router;
