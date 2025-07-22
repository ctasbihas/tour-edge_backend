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
const createTour = async (req: Request, res: Response) => {
	const newTour = await TourServices.createTour(req.body);

	sendResponse(res, {
		success: true,
		statusCode: 201,
		message: "Tour created successfully",
		data: newTour,
	});
};

export const TourControllers = {
	getAllTours,
	createTour,
};
