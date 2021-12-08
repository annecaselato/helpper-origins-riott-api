// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ListItemRepository } from '../../../../library/database/repository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * ListItemValidator
 *
 * Classe de validadores para o endpoint de itens de lista
 */
export class ListItemValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de itens de lista
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new ListItemRepository()),
            errorMessage: 'Item não encontrado'
        }
    };

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ListItemValidator.model.id
        });
    }
}
