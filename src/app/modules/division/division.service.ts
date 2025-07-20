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

export const DivisionServices = {
	getDivisions,
};
