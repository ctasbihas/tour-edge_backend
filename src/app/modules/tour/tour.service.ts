import AppError from "../../errorHelpers/AppError";
import { Division } from "../division/division.model";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

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

export const TourServices = {
	getAllTours,
	createTour,
};
