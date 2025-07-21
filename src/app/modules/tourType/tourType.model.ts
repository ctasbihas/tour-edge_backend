import { model, Schema } from "mongoose";
import { ITourType } from "./tourType.interface";

const tourTypeSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);
