import { configDotenv } from "dotenv";

configDotenv();

interface EnvVariables {
	PORT: string;
	MONGO_URI: string;
	NODE_ENV: "development" | "production";
	JWT_ACCESS_SECRET: string;
	JWT_ACCESS_EXPIRES: string;
	BCRYPT_SALT_ROUNDS: string;
}

const loadEnvs = (): EnvVariables => {
	const envs: string[] = [
		"PORT",
		"MONGO_URI",
		"NODE_ENV",
		"JWT_ACCESS_SECRET",
		"JWT_ACCESS_EXPIRES",
		"BCRYPT_SALT_ROUNDS",
	];
	envs.forEach((env) => {
		if (!process.env[env]) {
			throw new Error(`Environment variable ${env} is not defined`);
		}
	});
	return {
		PORT: process.env.PORT as string,
		MONGO_URI: process.env.MONGO_URI as string,
		NODE_ENV: process.env.NODE_ENV as "development" | "production",
		JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
		JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
		BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
	};
};

export const env = loadEnvs();
