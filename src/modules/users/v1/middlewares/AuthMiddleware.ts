// Modules
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Routes
import { RouteResponse } from '../../../../routes';

interface ITokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export function AuthMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if (!authorization) {
        RouteResponse.unauthorizedError(res);
    } else {
        const token = authorization.replace('Bearer', '').trim();

        try {
            const data = jwt.verify(token, 'secret');
            const { id } = data as ITokenPayload;
            req.userId = id;

            return next();
        } catch {
            RouteResponse.unauthorizedError(res);
        }
    }
}
