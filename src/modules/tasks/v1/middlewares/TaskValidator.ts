// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { TaskRepository } from '../../../../library/database/repository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Task } from '../../../../library/database/entity';

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
        description: BaseValidator.validators.name,
        id: {
            ...BaseValidator.validators.id(new TaskRepository()),
            errorMessage: 'Atividade não encontrada'
        },
        duplicate: {
            errorMessage: 'Atividade já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.description) {
                        const taskRepository: TaskRepository = new TaskRepository();
                        const task: Task | undefined = await taskRepository.findByDescription(req.body.description);

                        check = task ? req.body.id === task.id.toString() : true;
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
        return TaskValidator.validationList({
            description: TaskValidator.model.description,
            duplicate: TaskValidator.model.duplicate
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
