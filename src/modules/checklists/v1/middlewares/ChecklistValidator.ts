// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ChecklistRepository, MemberRepository } from '../../../../library/database/repository';

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
        memberId: {
            ...BaseValidator.validators.id(new MemberRepository()),
            errorMessage: 'Membro não encontrado'
        },
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
        }
    };

    /**
     * patch
     *
     * @returns Lista de validadores
     */
    public static patch(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ChecklistValidator.model.id,
            status: ChecklistValidator.model.status
        });
    }

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return ChecklistValidator.validationList({
            name: ChecklistValidator.model.name,
            memberId: ChecklistValidator.model.memberId,
            status: ChecklistValidator.model.status
        });
    }
}
