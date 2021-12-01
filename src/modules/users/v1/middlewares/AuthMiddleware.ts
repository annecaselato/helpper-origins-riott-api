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

/**
 * AuthMiddleware
 *
 * Classe de middleware que autentica o token nas rotas privadas
 */
export class AuthMiddleware {
    public static auth(req: Request, res: Response, next: NextFunction): void {
        const { authorization } = req.headers;

        if (!authorization) {
            RouteResponse.unauthorizedError(res);
        } else {
            const token = authorization.replace('Bearer', '').trim();

            try {
                const data = jwt.verify(token, 'secret');
                const { id } = data as ITokenPayload;
                req.userId = id;
                next();
            } catch {
                RouteResponse.unauthorizedError(res);
            }
        }
    }
}
