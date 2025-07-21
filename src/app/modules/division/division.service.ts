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

const updateDivision = async (id: string, divisionData: IDivision) => {
	const { name, slug, thumbnail, description } = divisionData;
	const existingDivision = await Division.findById(id);
	if (!existingDivision) {
		throw new AppError(404, "Division not found");
	}
	const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*-division$/;
	if (slug) {
		if (!slugRegex.test(slug)) {
			throw new AppError(
				400,
				"Invalid slug format. Slug must contain only lowercase letters, numbers, hyphens, and end with '-division'"
			);
		}
		const slugExists = await Division.findOne({ slug, _id: { $ne: id } });
		if (slugExists) {
			throw new AppError(400, "Division with this slug already exists");
		}
	}

	const updatedDivision = await Division.findByIdAndUpdate(
		id,
		{
			name,
			slug,
			thumbnail,
			description,
		},
		{
			new: true,
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

	// TODO: When Tour model is available, handle the error properly.
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
