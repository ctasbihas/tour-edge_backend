import { configDotenv } from "dotenv";

configDotenv();

interface EnvVariables {
	PORT: string;
	MONGO_URI: string;
	NODE_ENV: string;
}

const loadEnvs = (): EnvVariables => {
	const envs: string[] = ["PORT", "MONGO_URI", "NODE_ENV"];
	envs.forEach((env) => {
		if (!process.env[env]) {
			throw new Error(`Environment variable ${env} is not defined`);
		}
	});
	return {
		PORT: process.env.PORT as string,
		MONGO_URI: process.env.MONGO_URI as string,
		NODE_ENV: process.env.NODE_ENV as string,
	};
};

export const env = loadEnvs();
