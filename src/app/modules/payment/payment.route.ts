import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post("/success", PaymentControllers.success);
router.post("/fail", PaymentControllers.fail);
router.post("/cancel", PaymentControllers.cancel);
router.get("/init-payment/:bookingId", PaymentControllers.initPayment);

export const PaymentRoutes = router;
