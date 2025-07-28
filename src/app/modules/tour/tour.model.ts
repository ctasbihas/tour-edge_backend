import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			unique: true,
		},
		description: {
			type: String,
		},
		images: {
			type: [String],
			default: [],
		},
		location: {
			type: String,
		},
		costFrom: {
			type: Number,
		},
		startDate: {
			type: Date,
		},
		endDate: {
			type: Date,
		},
		included: {
			type: [String],
			default: [],
		},
		excluded: {
			type: [String],
			default: [],
		},
		amenities: {
			type: [String],
			default: [],
		},
		tourPlan: {
			type: [String],
			default: [],
		},
		maxGuest: {
			type: Number,
		},
		minAge: {
			type: Number,
		},
		division: {
			type: Schema.Types.ObjectId,
			ref: "Division",
			required: true,
		},
		tourType: {
			type: Schema.Types.ObjectId,
			ref: "TourType",
			required: true,
		},
	},
	{ timestamps: true }
);

tourSchema.pre("save", async function (next) {
	if (this.isModified("title")) {
		const slug = this.title.toLowerCase().split(" ").join("-");

		this.slug = slug;
	}

	next();
});
tourSchema.pre("findOneAndUpdate", async function (next) {
	const update = this.getUpdate() as Partial<ITour>;
	if (update.title) {
		const slug = update.title.toLowerCase().split(" ").join("-");

		update.slug = slug;
	}
	next();
});

export const Tour = model<ITour>("Tour", tourSchema);
