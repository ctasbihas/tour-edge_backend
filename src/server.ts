/* eslint-disable no-console */

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const PORT = 5000;

const startServer = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://fenzor:fenzor@projects.yc3yzra.mongodb.net/tour-edge?retryWrites=true&w=majority&appName=projects"
		);
		console.log("Connected to MongoDB");

		server = app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server:", error);
	}
};

startServer();

process.on("unhandledRejection", () => {
	console.error("Unhandled Rejection, shutting down server...");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});
process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception, shutting down server...", error);
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});
process.on("SIGTERM", () => {
	console.log("SIGTERM received, shutting down gracefully...");
	if (server) {
		server.close(() => {
			console.log("Server closed");
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
});
