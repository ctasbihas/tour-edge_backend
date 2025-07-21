import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const getDivisions = async () => {
	const divisions = await Division.find();
	const totalDivisions = await Division.countDocuments();
	return {
		data: divisions,
		meta: {
			total: totalDivisions,
		},
	};
};

const createDivision = async (divisionData: IDivision) => {
	const { name, ...rest } = divisionData;
	if (!name) {
		throw new AppError(400, "Division name is required");
	}

	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-division";

	const existingDivision = await Division.findOne({ slug });
	if (existingDivision) {
		throw new AppError(400, "Division with this name already exists");
	}

	const newDivision = await Division.create({
		name,
		...rest,
		slug,
	});

	return newDivision;
};

export const DivisionServices = {
	getDivisions,
	createDivision,
};
