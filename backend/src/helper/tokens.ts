import jwt from "jsonwebtoken"

interface UserPayload {
    user_id: string,
    email: string,
}

export const generateTokens = (user: UserPayload) => {
    const payload = { user_id: user.user_id, email: user.email };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
}