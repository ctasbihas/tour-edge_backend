import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
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
	if (!divisionData.name) {
		throw new AppError(400, "Division name is required");
	}

	const newDivision = await Division.create(divisionData);

	return newDivision;
};

const updateDivision = async (id: string, divisionData: IDivision) => {
	const existingDivision = await Division.findById(id);
	if (!existingDivision) {
		throw new AppError(404, "Division not found");
	}

	const slug =
		divisionData.name.toLowerCase().split(" ").join("-") + "-division";
	const existingSlugDivision = await Division.findOne({ slug });
	if (existingSlugDivision && existingSlugDivision._id.toString() !== id) {
		throw new AppError(400, "Division with this name already exists");
	}

	const updatedDivision = await Division.findByIdAndUpdate(
		id,
		{
			...divisionData,
			slug,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	return updatedDivision;
};

const deleteDivision = async (id: string) => {
	const deletedDivision = await Division.findByIdAndDelete(id);
	if (!deletedDivision) {
		throw new AppError(404, "Division not found");
	}
	const associatedTours = await Tour.countDocuments({ division: id });
	if (associatedTours > 0) {
		throw new AppError(
			400,
			`Cannot delete division. It is associated with ${associatedTours} tour(s). Please remove or reassign these tours first.`
		);
	}

	return deletedDivision;
};

export const DivisionServices = {
	getDivisions,
	createDivision,
	updateDivision,
	deleteDivision,
};
