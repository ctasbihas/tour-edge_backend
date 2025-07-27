import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/response";
import { TourServices } from "./tour.service";

const getAllTours = catchAsync(async (req: Request, res: Response) => {
	const filter = req.query as Record<string, string>;
	const result = await TourServices.getAllTours(filter);

	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "Tours retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});
const createTour = catchAsync(async (req: Request, res: Response) => {
	const newTour = await TourServices.createTour(req.body);

	sendResponse(res, {
		success: true,
		statusCode: 201,
		message: "Tour created successfully",
		data: newTour,
	});
});
const updateTour = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updateData = req.body;

	const updatedTour = await TourServices.updateTour(id, updateData);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tour updated successfully",
		data: updatedTour,
	});
});
const deleteTour = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	await TourServices.deleteTour(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tour deleted successfully",
		data: null,
	});
});

// Tour Type Controllers
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
	const result = await TourServices.getAllTourTypes();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tour types retrieved successfully",
		data: result,
	});
});
const createTourType = catchAsync(async (req, res) => {
	const result = await TourServices.createTourType(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Tour type created successfully",
		data: result,
	});
});
const updateTourType = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await TourServices.updateTourType(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tour type updated successfully",
		data: result,
	});
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	await TourServices.deleteTourType(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tour type deleted successfully",
		data: null,
	});
});

export const TourControllers = {
	getAllTours,
	createTour,
	updateTour,
	deleteTour,
	getAllTourTypes,
	createTourType,
	updateTourType,
	deleteTourType,
};
