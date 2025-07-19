/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ZodError } from "zod";
import AppError from "../errorHelpers/AppError";

// Helper function to handle Zod errors
const handleZodError = (err: ZodError) => {
	const errorSources = err.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));

	return {
		statusCode: 400,
		message: "Validation failed",
		errorSources,
	};
};

// Helper function to handle Mongoose Cast errors
const handleCastError = (err: Error.CastError) => {
	const errorSources = [
		{
			path: err.path,
			message: `Invalid ${err.path}: ${err.value}`,
		},
	];

	return {
		statusCode: 400,
		message: "Invalid data format",
		errorSources,
	};
};

// Helper function to handle Mongoose Validation errors
const handleValidationError = (err: Error.ValidationError) => {
	const errorSources = Object.values(err.errors).map((error: any) => ({
		path: error.path,
		message: error.message,
	}));

	return {
		statusCode: 400,
		message: "Validation failed",
		errorSources,
	};
};

// Helper function to handle MongoDB duplicate key errors
const handleDuplicateKeyError = (err: any) => {
	const matchedArray = err.message.match(/"([^"]+)"/);
	const extractedValue = matchedArray ? matchedArray[1] : "Unknown field";

	const errorSources = [
		{
			path: Object.keys(err.keyValue || {})[0] || "unknown",
			message: `${extractedValue} already exists`,
		},
	];

	return {
		statusCode: 400,
		message: "Duplicate entry error",
		errorSources,
	};
};

export const globalErrorHandler = (
	err: any,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	_next: NextFunction
) => {
	let statusCode = 500;
	let message = "Something went wrong!";
	let errorSources: { path: string; message: string }[] = [];

	// Handle Zod validation errors
	if (err instanceof ZodError) {
		const zodError = handleZodError(err);
		statusCode = zodError.statusCode;
		message = zodError.message;
		errorSources = zodError.errorSources;
	}
	// Handle MongoDB duplicate key error (11000)
	else if (err.code === 11000) {
		const duplicateError = handleDuplicateKeyError(err);
		statusCode = duplicateError.statusCode;
		message = duplicateError.message;
		errorSources = duplicateError.errorSources;
	}
	// Handle Mongoose Cast errors
	else if (err instanceof Error.CastError) {
		const castError = handleCastError(err);
		statusCode = castError.statusCode;
		message = castError.message;
		errorSources = castError.errorSources;
	}
	// Handle Mongoose Validation errors
	else if (err instanceof Error.ValidationError) {
		const validationError = handleValidationError(err);
		statusCode = validationError.statusCode;
		message = validationError.message;
		errorSources = validationError.errorSources;
	}
	// Handle Mongoose Document Not Found errors
	else if (err instanceof Error.DocumentNotFoundError) {
		statusCode = 404;
		message = "Document not found";
		errorSources = [
			{
				path: "document",
				message: "The requested document could not be found",
			},
		];
	}
	// Handle Mongoose Version errors
	else if (err instanceof Error.VersionError) {
		statusCode = 409;
		message = "Version conflict occurred";
		errorSources = [
			{
				path: "version",
				message: "Document was modified by another process",
			},
		];
	}
	// Handle Mongoose Parallel Save errors
	else if (err instanceof Error.ParallelSaveError) {
		statusCode = 500;
		message = "Concurrent save operations detected";
		errorSources = [
			{
				path: "save",
				message: "Multiple save operations occurring simultaneously",
			},
		];
	}
	// Handle custom AppError
	else if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
		errorSources = [
			{
				path: "application",
				message: err.message,
			},
		];
	}
	// Handle generic JavaScript errors
	else if (err instanceof Error) {
		message = err.message;
		errorSources = [
			{
				path: "system",
				message: err.message,
			},
		];
	}

	const errorResponse = {
		statusCode,
		success: false,
		message,
		errorSources,
		...(process.env.NODE_ENV === "development" && {
			error: err.name,
			stack: err.stack,
		}),
	};

	res.status(statusCode).json(errorResponse);
};
