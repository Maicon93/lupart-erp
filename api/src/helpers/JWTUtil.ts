import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import environment from '../config/environment';

interface ITokenPayload {
    userId: number;
    role: string;
}

const SECRET = environment.JWT_SECRET;
const ACCESS_EXPIRES_IN = environment.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = environment.JWT_REFRESH_EXPIRES_IN;

const generateAccessToken = (payload: ITokenPayload): string => {
    return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

const verifyAccessToken = (token: string): ITokenPayload => {
    return jwt.verify(token, SECRET) as ITokenPayload;
};

const generateRefreshToken = (): string => {
    return crypto.randomBytes(40).toString('hex');
};

const getRefreshExpiresAt = (): Date => {
    const match = REFRESH_EXPIRES_IN.match(/^(\d+)([dhms])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
};

export default {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    getRefreshExpiresAt,
};
