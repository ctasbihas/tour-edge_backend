import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			unique: true,
		},
		thumbnail: {
			type: String,
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true, versionKey: false }
);

divisionSchema.pre("save", async function (next) {
	if (this.isModified("name")) {
		const slug = this.name.toLowerCase().split(" ").join("-") + "-division";

		this.slug = slug;
	}

	next();
});
divisionSchema.pre("findOneAndUpdate", async function (next) {
	const update = this.getUpdate() as Partial<IDivision>;
	if (update.name) {
		const slug =
			update.name.toLowerCase().split(" ").join("-") + "-division";

		update.slug = slug;
	}
	next();
});

export const Division = model<IDivision>("Division", divisionSchema);
