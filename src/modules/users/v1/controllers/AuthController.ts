// Modules
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Library
import { BaseController } from '../../../../library';

// Entities
import { User } from '../../../../library/database/entity';

// Repositories
import { UserRepository } from '../../../../library/database/repository';

// Decorators
import { Controller, Post, PublicRoute } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

@Controller(EnumEndpoints.AUTH_V1)
export class AuthController extends BaseController {
    /**
     * @swagger
     * /v1/auth:
     *   post:
     *     summary: Autentica os dados de login
     *     tags: [Auth]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               email: userEmail
     *               password: userPassword
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Post()
    @PublicRoute()
    public async authenticate(req: Request, res: Response): Promise<void> {
        const repository: UserRepository = new UserRepository();
        const user: User | undefined = await repository.findByEmail(req.body.email);

        // Autenticação do email
        if (!user) {
            RouteResponse.error('Email inválido', res);
        } else {
            // Autenticação da senha
            const isValidPassword: boolean = await bcrypt.compare(req.body.password, user.password);

            if (!isValidPassword) {
                RouteResponse.error('Senha incorreta', res);
            }

            // Gerando o token
            const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
            RouteResponse.successEmpty(res.json(token));
        }
    }
}
