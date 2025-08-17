import { configDotenv } from "dotenv";

configDotenv();

interface EnvVariables {
	PORT: string;
	MONGO_URI: string;
	NODE_ENV: "development" | "production";
	JWT_ACCESS_SECRET: string;
	JWT_ACCESS_EXPIRES: string;
	JWT_REFRESH_SECRET: string;
	JWT_REFRESH_EXPIRES: string;
	BCRYPT_SALT_ROUNDS: string;
	SUPER_ADMIN_EMAIL: string;
	SUPER_ADMIN_PASSWORD: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_CALLBACK_URL: string;
	EXPRESS_SESSION_SECRET: string;
	FRONTEND_URL: string;
	BACKEND_URL: string;
	SSL: {
		STORE_ID: string;
		STORE_PASSWORD: string;
		PAYMENT_API: string;
		VALIDATION_API: string;
	};
}

const loadEnvs = (): EnvVariables => {
	const envs: string[] = [
		"PORT",
		"MONGO_URI",
		"NODE_ENV",
		"JWT_ACCESS_SECRET",
		"JWT_ACCESS_EXPIRES",
		"JWT_REFRESH_SECRET",
		"JWT_REFRESH_EXPIRES",
		"BCRYPT_SALT_ROUNDS",
		"SUPER_ADMIN_EMAIL",
		"SUPER_ADMIN_PASSWORD",
		"GOOGLE_CLIENT_ID",
		"GOOGLE_CLIENT_SECRET",
		"GOOGLE_CALLBACK_URL",
		"EXPRESS_SESSION_SECRET",
		"FRONTEND_URL",
		"BACKEND_URL",
		"SSL_STORE_ID",
		"SSL_STORE_PASSWORD",
		"SSL_PAYMENT_API",
		"SSL_VALIDATION_API",
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
		JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
		JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
		BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
		SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
		SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
		GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
		EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
		FRONTEND_URL: process.env.FRONTEND_URL as string,
		BACKEND_URL: process.env.BACKEND_URL as string,
		SSL: {
			STORE_ID: process.env.SSL_STORE_ID as string,
			STORE_PASSWORD: process.env.SSL_STORE_PASSWORD as string,
			PAYMENT_API: process.env.SSL_PAYMENT_API as string,
			VALIDATION_API: process.env.SSL_VALIDATION_API as string,
		},
	};
};

export const env = loadEnvs();
