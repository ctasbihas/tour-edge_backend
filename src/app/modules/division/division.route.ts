import { Router } from "express";
import { DivisionControllers } from "./division.controller";

const router = Router();

router.get("/", DivisionControllers.getDivisions);

export const DivisionRoutes = router;
