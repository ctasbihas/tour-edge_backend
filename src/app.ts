import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello, World!");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;
