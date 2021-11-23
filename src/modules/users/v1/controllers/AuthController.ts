// Modules
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Entities
import { User } from '../../../../library/database/entity';

// Repositories
import { UserRepository } from '../../../../library/database/repository';

// Routes
import { RouteResponse } from '../../../../routes';

export class AuthController extends BaseController {
    async authenticate(req: Request, res: Response): Promise<void> {
        const user: User = req.body.userRef;

        user.email = req.body.name;
        user.password = req.body.password;

        if (!(await new UserRepository().findByEmail(user.email))) {
            RouteResponse.error('Email inválido', res);
        }
    }
}
