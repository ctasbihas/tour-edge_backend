import { Response } from "express";

interface AuthCookie {
	accessToken?: string;
	refreshToken?: string;
}

export const setAuthCookie = (res: Response, token: AuthCookie) => {
	if (token.accessToken) {
		res.cookie("access_token", token.accessToken, {
			httpOnly: true,
			secure: false,
		});
	}
	if (token.refreshToken) {
		res.cookie("refresh_token", token.refreshToken, {
			httpOnly: true,
			secure: false,
		});
	}
};
