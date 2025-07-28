import { Request, Response } from "express";
import sendResponse from "../../utils/response";
import { DivisionServices } from "./division.service";

const getDivisions = async (req: Request, res: Response) => {
	const divisions = await DivisionServices.getDivisions();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Divisions retrieved successfully",
		meta: {
			total: divisions.meta.total,
		},
		data: divisions.data,
	});
};
const getSingleDivision = async (req: Request, res: Response) => {
	const { slug } = req.params;
	const division = await DivisionServices.getSingleDivision(slug);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Division retrieved successfully",
		data: division,
	});
};
const createDivision = async (req: Request, res: Response) => {
	const newDivision = await DivisionServices.createDivision(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Division created successfully",
		data: newDivision,
	});
};
const updateDivision = async (req: Request, res: Response) => {
	const { id } = req.params;
	const updatedDivision = await DivisionServices.updateDivision(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Division updated successfully",
		data: updatedDivision,
	});
};
const deleteDivision = async (req: Request, res: Response) => {
	const { id } = req.params;
	const deletedDivision = await DivisionServices.deleteDivision(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Division deleted successfully",
		data: deletedDivision,
	});
};

export const DivisionControllers = {
	getDivisions,
	getSingleDivision,
	createDivision,
	updateDivision,
	deleteDivision,
};
