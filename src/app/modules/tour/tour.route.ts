import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import {
	createTourTypeZodSchema,
	createTourZodSchema,
	updateTourTypeZodSchema,
	updateTourZodSchema,
} from "./tour.validation";

const router = Router();

// Tour Type Routes
router.get("/tour-types", TourControllers.getAllTourTypes);
router.post(
	"/create-tour-type",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(createTourTypeZodSchema),
	TourControllers.createTourType
);
router.patch(
	"/tour-types/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(updateTourTypeZodSchema),
	TourControllers.updateTourType
);
router.delete(
	"/tour-types/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	TourControllers.deleteTourType
);

// Tour Routes
router.get(
	"/",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	TourControllers.getAllTours
);
router.post(
	"/create",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	multerUpload.array("files"),
	validateRequest(createTourZodSchema),
	TourControllers.createTour
);
router.patch(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(updateTourZodSchema),
	TourControllers.updateTour
);
router.delete(
	"/:id",
	checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	TourControllers.deleteTour
);

// Keep the dynamic slug route last to prevent it from capturing other paths
router.get("/:slug", TourControllers.getSingleTour);

export const TourRoutes = router;
