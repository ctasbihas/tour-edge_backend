import { deleteCloudinaryImage } from "../../config/cloudinary.config";
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
const getSingleDivision = async (slug: string) => {
	const division = await Division.findOne({ slug });
	if (!division) {
		throw new AppError(404, "Division not found");
	}

	return division;
};
const createDivision = async (divisionData: IDivision) => {
	const newDivision = await Division.create(divisionData);

	return newDivision;
};

const updateDivision = async (id: string, payload: IDivision) => {
	const existingDivision = await Division.findById(id);
	if (!existingDivision) {
		throw new AppError(404, "Division not found");
	}

	if (payload.thumbnail && existingDivision.thumbnail) {
		await deleteCloudinaryImage(existingDivision.thumbnail);
	}

	const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});

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
	if (deletedDivision.thumbnail) {
		await deleteCloudinaryImage(deletedDivision.thumbnail);
	}

	return deletedDivision;
};

export const DivisionServices = {
	getDivisions,
	getSingleDivision,
	createDivision,
	updateDivision,
	deleteDivision,
};
