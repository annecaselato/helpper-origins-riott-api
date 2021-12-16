import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { User } from '../../../../library/database/entity';

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        id: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: 'Usuário não encontrado'
        },
        email: {
            in: 'body',
            isString: true,
            isEmail: true,
            trim: true,
            errorMessage: 'Email inválido'
        },
        password: {
            in: 'body',
            isString: true,
            isLength: {
                errorMessage: 'A senha deve conter no mínimo 6 caracteres',
                options: { min: 6 }
            },
            trim: true,
            errorMessage: 'Senha inválida'
        },
        duplicate: {
            errorMessage: 'Usuário já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByName(req.body.name);

                        check = user ? req.body.id === user.id.toString() : true;
                    }

                    if (req.body.email) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByEmail(req.body.email);

                        check = user ? req.body.id === user.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return UserValidator.validationList({
            name: UserValidator.model.name,
            email: UserValidator.model.email,
            password: UserValidator.model.password,
            duplicate: UserValidator.model.duplicate
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return UserValidator.validationList({
            id: UserValidator.model.id,
            ...UserValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: UserValidator.model.id
        });
    }
}
