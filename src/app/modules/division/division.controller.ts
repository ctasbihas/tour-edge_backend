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

export const DivisionControllers = {
	getDivisions,
};
