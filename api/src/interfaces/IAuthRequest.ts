import { Request } from 'express';

export interface IAuthRequest extends Request {
    userId?: number;
    userRole?: string;
    companyId?: number;
}
