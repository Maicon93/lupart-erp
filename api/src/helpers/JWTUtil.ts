import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import environment from '../config/environment';

interface ITokenPayload {
    userId: number;
    role: string;
}

const secret: jwt.Secret = environment.JWT_SECRET;
const accessExpiresIn: string = environment.JWT_EXPIRES_IN;
const refreshExpiresIn: string = environment.JWT_REFRESH_EXPIRES_IN;

export function generateAccessToken(payload: ITokenPayload): string {
    return jwt.sign({ ...payload }, secret, { expiresIn: accessExpiresIn as unknown as number });
}

export function verifyAccessToken(token: string): ITokenPayload {
    return jwt.verify(token, secret) as ITokenPayload;
}

export function generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
}

export function getRefreshExpiresAt(): Date {
    const match = refreshExpiresIn.match(/^(\d+)([dhms])$/);
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
}
