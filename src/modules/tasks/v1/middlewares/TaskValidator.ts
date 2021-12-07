// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { TaskRepository } from '../../../../library/database/repository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * TaskValidator
 *
 * Classe de validadores para o endpoint de atividades
 */
export class TaskValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de atividades
     */
    private static model: Schema = {
        description: {
            ...BaseValidator.validators.name,
            isLength: {
                options: {
                    min: 10
                }
            },
            errorMessage: 'A Descrição deve conter ao menos 10 caracteres'
        },
        id: {
            ...BaseValidator.validators.id(new TaskRepository()),
            errorMessage: 'Atividade não encontrada'
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return TaskValidator.validationList({
            description: TaskValidator.model.description
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return TaskValidator.validationList({
            id: TaskValidator.model.id,
            ...TaskValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: TaskValidator.model.id
        });
    }
}
