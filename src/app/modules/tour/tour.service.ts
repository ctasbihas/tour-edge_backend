import { Tour } from "./tour.model";

const getAllTours = async () => {
	const tours = await Tour.find();

	return tours;
};

export const TourServices = {
	getAllTours,
};
