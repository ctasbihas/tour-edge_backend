import { Request, Response } from "express";
import sendResponse from "../../utils/response";
import { TourServices } from "./tour.service";

const getAllTours = async (req: Request, res: Response) => {
	const tours = await TourServices.getAllTours();

	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "Tours retrieved successfully",
		data: tours,
	});
};

export const TourControllers = {
	getAllTours,
};
