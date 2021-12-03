// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ChecklistRepository, MemberRepository } from '../../../../library/database/repository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

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
            memberId: ChecklistValidator.model.memberId
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

    /**
     * memberId
     *
     * @returns Lista de validadores
     */
    public static memberId(): RequestHandler[] {
        return BaseValidator.validationList({
            memberId: ChecklistValidator.model.memberId
        });
    }
}
