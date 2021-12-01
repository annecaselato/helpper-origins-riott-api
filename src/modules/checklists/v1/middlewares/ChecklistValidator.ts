// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ChecklistRepository } from '../../../../library/database/repository/ChecklistRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Checklist } from '../../../../library/database/entity';

// Models
import { EnumListStatus } from '../../../../models';

/**
 * ChecklistValidator
 *
 * Classe de validadores para o endpoint de listas de marcação
 */
export class ChecklistValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de listas de marcação
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        status: {
            in: 'body',
            custom: {
                options: status => {
                    return Object.values(EnumListStatus).includes(status);
                }
            },
            trim: true,
            errorMessage: 'Status inválido'
        },
        id: {
            ...BaseValidator.validators.id(new ChecklistRepository()),
            errorMessage: 'Lista não encontrada'
        },
        duplicate: {
            errorMessage: 'Lista já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const checklistRepository: ChecklistRepository = new ChecklistRepository();
                        const checklist: Checklist | undefined = await checklistRepository.findByName(req.body.name);

                        check = checklist ? req.body.id === checklist.id.toString() : true;
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
        return ChecklistValidator.validationList({
            name: ChecklistValidator.model.name,
            duplicate: ChecklistValidator.model.duplicate
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ChecklistValidator.validationList({
            id: ChecklistValidator.model.id,
            ...ChecklistValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ChecklistValidator.model.id
        });
    }
}
