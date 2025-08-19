import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";
import {
	createDivisionZodSchema,
	updateDivisionZodSchema,
} from "./division.validation";

const router = Router();

router.get("/", DivisionControllers.getDivisions);
router.get("/:slug", DivisionControllers.getSingleDivision);
router.post(
	"/create",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	multerUpload.single("file"),
	validateRequest(createDivisionZodSchema),
	DivisionControllers.createDivision
);
router.patch(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(updateDivisionZodSchema),
	DivisionControllers.updateDivision
);
router.delete(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	DivisionControllers.deleteDivision
);

export const DivisionRoutes = router;
