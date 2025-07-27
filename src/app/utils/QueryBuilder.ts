import { Query } from "mongoose";
import { excludeFields } from "../constants";

export class QueryBuilder<T> {
	public modelQuery: Query<T[], T>;
	public readonly query: Record<string, string>;

	constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
		this.modelQuery = modelQuery;
		this.query = query;
	}

	filter(): this {
		const filter = { ...this.query };

		for (const field of excludeFields) {
			delete filter[field];
		}

		this.modelQuery = this.modelQuery.find(filter);

		return this;
	}

	search(searchField: string[]): this {
		const searchTerm = this.query.searchTerm || "";
		const searchFilter = {
			$or: searchField.map((field) => ({
				[field]: { $regex: searchTerm, $options: "i" },
			})),
		};
		this.modelQuery = this.modelQuery.find(searchFilter);
		return this;
	}

	sort(): this {
		const sortBy = this.query.sortBy || "createdAt";
		this.modelQuery = this.modelQuery.sort(sortBy);

		return this;
	}

	fields(): this {
		const fields = this.query.selectFields?.split(",").join(" ") || "";
		this.modelQuery = this.modelQuery.select(fields);
		return this;
	}

	paginate(): this {
		const page = Number(this.query.page) || 1;
		const limit = Number(this.query.limit) || 10;
		const skip = (page - 1) * limit;

		this.modelQuery = this.modelQuery.skip(skip).limit(limit);

		return this;
	}

	build() {
		return this.modelQuery;
	}

	async getMeta() {
		const totalDocs = await this.modelQuery.model.countDocuments();
		const page = Number(this.query.page) || 1;
		const limit = Number(this.query.limit) || 10;
		const totalPages = Math.ceil(totalDocs / limit);

		return {
			total: totalDocs,
			page,
			limit,
			totalPages,
		};
	}
}
