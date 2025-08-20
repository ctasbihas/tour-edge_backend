import { deleteCloudinaryImage } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Division } from "../division/division.model";
import { tourSearchFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const getAllTours = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(Tour.find(), query);
	const tours = await queryBuilder
		.filter()
		.search(tourSearchFields)
		.sort()
		.fields()
		.paginate();
	const [data, meta] = await Promise.all([
		tours.build(),
		queryBuilder.getMeta(),
	]);

	return {
		data,
		meta,
	};
};
const getSingleTour = async (slug: string) => {
	const tour = await Tour.findOne({ slug })
		.populate("division", "name slug thumbnail description")
		.populate("tourType", "name");
	if (!tour) {
		throw new AppError(404, "Tour not found");
	}

	return tour;
};
const createTour = async (tourData: ITour) => {
	if (tourData.division) {
		const existingDivision = await Division.findById(tourData.division);
		if (!existingDivision) {
			throw new AppError(404, "Division not found");
		}
	}
	if (tourData.tourType) {
		const existingTourType = await TourType.findById(tourData.tourType);
		if (!existingTourType) {
			throw new AppError(404, "Tour type not found");
		}
	}

	const newTour = await Tour.create(tourData);
	return newTour;
};
const updateTour = async (id: string, updateData: ITour) => {
	const existingTour = await Tour.findById(id);
	if (!existingTour) {
		throw new AppError(404, "Tour not found");
	}

	if (updateData.division) {
		const existingDivision = await Division.findById(updateData.division);
		if (!existingDivision) {
			throw new AppError(404, "Division not found");
		}
	}
	if (updateData.tourType) {
		const existingTourType = await TourType.findById(updateData.tourType);
		if (!existingTourType) {
			throw new AppError(404, "Tour type not found");
		}
	}

	const updatedTour = await Tour.findByIdAndUpdate(id, updateData, {
		new: true,
		runValidators: true,
	})
		.populate("division", "name slug thumbnail description")
		.populate("tourType", "name");

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

	if (Array.isArray(tour.images) && tour.images.length) {
		await Promise.all(
			tour.images.map((imageUrl) => deleteCloudinaryImage(imageUrl))
		);
	}

	const result = await Tour.deleteOne({ _id: id });
	return result;
};

// Tour Type Services
const getAllTourTypes = async () => {
	const result = await TourType.find();
	return result;
};
const createTourType = async (payload: ITourType) => {
	const existingTourType = await TourType.findOne({ name: payload.name });
	if (existingTourType) {
		throw new AppError(400, "Tour type with this name already exists");
	}

	const result = await TourType.create(payload);
	return result;
};
const updateTourType = async (id: string, payload: ITourType) => {
	const tourType = await TourType.findById(id);
	if (!tourType) {
		throw new AppError(404, "Tour type not found");
	}
	if (payload.name === tourType.name) {
		return tourType;
	}
	if (payload.name && payload.name !== tourType.name) {
		const existingTourType = await TourType.findOne({ name: payload.name });
		if (existingTourType) {
			throw new AppError(400, "Tour type with this name already exists");
		}
	}

	const result = await TourType.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});

	return result;
};
const deleteTourType = async (id: string) => {
	const tourType = await TourType.findById(id);
	if (!tourType) {
		throw new AppError(404, "Tour type not found");
	}

	const linkedTours = await Tour.find({ tourType: id });
	if (linkedTours.length > 0) {
		throw new AppError(
			400,
			"Cannot delete tour type. Tours are linked to this tour type."
		);
	}

	const result = await TourType.findByIdAndDelete(id);
	return result;
};

export const TourServices = {
	getAllTours,
	getSingleTour,
	createTour,
	updateTour,
	deleteTour,
	getAllTourTypes,
	createTourType,
	updateTourType,
	deleteTourType,
};
