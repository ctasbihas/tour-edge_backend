import { Request, Response, Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { DivisionServices } from "./division.service";

const router = Router();

router.get(
	"/",
	catchAsync(async (req: Request, res: Response) => {
		const result = await DivisionServices.getDivisions();

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Divisions retrieved successfully",
			meta: {
				total: result.meta.total,
			},
			data: result.data,
		});
	})
);

export const DivisionRoutes = router;
