/* eslint-disable no-console */

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { env } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const PORT = 5000;

const startServer = async () => {
	try {
		await mongoose.connect(env.MONGO_URI);
		console.log("Connected to MongoDB");

		server = app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server:", error);
	}
};

(async () => {
	await startServer();
	await seedSuperAdmin();
})();

process.on("SIGTERM", () => {
	console.log("SIGTERM received, shutting down gracefully...");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});
process.on("SIGINT", () => {
	console.log("SIGTERM received, shutting down gracefully...");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});
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
