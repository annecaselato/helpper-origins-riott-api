// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ChecklistRepository } from '../../../../library/database/repository/ChecklistRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

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
        memberId: { in: 'body', isString: true, errorMessage: 'Membro inválido' },
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
        initialAllowance: { in: 'body', isNumeric: true, errorMessage: 'Mesada inválida' },
        deduction: { in: 'body', isNumeric: true, errorMessage: 'Desconto invalido' },
        finalAllowance: { in: 'body', isNumeric: true, errorMessage: 'Total inválido' },
        id: {
            ...BaseValidator.validators.id(new ChecklistRepository()),
            errorMessage: 'Lista não encontrada'
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
     * delete
     *
     * @returns Lista de validadores
     */
    public static delete(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ChecklistValidator.model.id,
            status: {
                in: 'body',
                custom: {
                    options: status => {
                        return Object.values(EnumListStatus).includes(status);
                    }
                },
                trim: true,
                errorMessage: 'Status inválido'
            }
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
