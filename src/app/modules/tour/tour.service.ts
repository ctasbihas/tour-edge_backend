import AppError from "../../errorHelpers/AppError";
import { Division } from "../division/division.model";
import { ITour } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const getAllTours = async () => {
	const tours = await Tour.find().populate(
		"Division",
		"name slug thumbnail description"
	);
	// .populate("tourType", "name description"); // Get tour type details

	return tours;
};
const createTour = async (tourData: ITour) => {
	const newTour = await Tour.create(tourData);
	if (tourData.division) {
		const existingDivision = await Division.findById(tourData.division);
		if (!existingDivision) {
			throw new AppError(404, "Division not found");
		}
	}
	if (tourData.tourType) {
		const existingTourType = await Division.findById(tourData.tourType);
		if (!existingTourType) {
			throw new AppError(404, "Tour type not found");
		}
	}
	return newTour;
};
const updateTour = async (id: string, updateData: Partial<ITour>) => {
	// Check if tour exists
	const existingTour = await Tour.findById(id);
	if (!existingTour) {
		throw new AppError(404, "Tour not found");
	}

	// Validate division if provided
	if (updateData.division) {
		const existingDivision = await Division.findById(updateData.division);
		if (!existingDivision) {
			throw new AppError(404, "Division not found");
		}
	}

	// TODO: Note: Add tourType validation when TourType model is available
	// if (updateData.tourType) {
	// 	const existingTourType = await TourType.findById(updateData.tourType);
	// 	if (!existingTourType) {
	// 		throw new AppError(404, "Tour type not found");
	// 	}
	// }

	if (updateData.slug) {
		const tourWithSlug = await Tour.findOne({
			slug: updateData.slug,
			_id: { $ne: id },
		});
		if (tourWithSlug) {
			throw new AppError(400, "Tour with this slug already exists");
		}
	}

	if (updateData.title && !updateData.slug) {
		const autoSlug = updateData.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-");
		const slugExists = await Tour.findOne({
			slug: autoSlug,
			_id: { $ne: id },
		});

		if (!slugExists) {
			updateData.slug = autoSlug;
		}
	}

	const updatedTour = await Tour.findByIdAndUpdate(id, updateData, {
		new: true,
		runValidators: true,
	}).populate("division", "name slug thumbnail description");
	// .populate("tourType", "name description");

	return updatedTour;
};
const deleteTour = async (id: string) => {
	const tour = await Tour.findById(id);
	if (!tour) {
		throw new AppError(404, "Tour not found");
	}

	// Check if tour is currently active or has future dates
	const currentDate = new Date();
	if (tour.startDate && new Date(tour.startDate) > currentDate) {
		throw new AppError(
			400,
			"Cannot delete tour. This tour has future scheduled dates."
		);
	}

	const result = await Tour.deleteOne({ _id: id });
	return result;
};

// Tour Type Services
const getAllTourTypes = async () => {
	const result = await TourType.find().sort({
		createdAt: -1,
	});
	return result;
};

export const TourServices = {
	getAllTours,
	createTour,
	updateTour,
	deleteTour,
	getAllTourTypes,
};
