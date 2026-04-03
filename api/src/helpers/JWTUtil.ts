import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import environment from '../config/environment';

interface ITokenPayload {
    userId: number;
    role: string;
}

export default class JWTUtil {
    private static readonly secret: jwt.Secret = environment.JWT_SECRET;
    private static readonly accessExpiresIn: string = environment.JWT_EXPIRES_IN;
    private static readonly refreshExpiresIn: string = environment.JWT_REFRESH_EXPIRES_IN;

    static generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign({ ...payload }, this.secret, { expiresIn: this.accessExpiresIn as unknown as number });
    }

    static verifyAccessToken(token: string): ITokenPayload {
        return jwt.verify(token, this.secret) as ITokenPayload;
    }

    static generateRefreshToken(): string {
        return crypto.randomBytes(40).toString('hex');
    }

    static getRefreshExpiresAt(): Date {
        const match = this.refreshExpiresIn.match(/^(\d+)([dhms])$/);
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
}

