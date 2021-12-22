// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ChecklistRepository, MemberRepository, TaskRepository } from '../../../../library/database/repository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * ChecklistValidator
 *
 * Classe de validadores para o endpoint de listas de marcação
 */
export class ChecklistValidator extends BaseValidator {
    /**
     * listItemsModel
     *
     * Schema para validação de itens de listas de marcação
     */
    private static listItemsModel: Schema = {
        listItems: {
            isArray: true,
            isLength: {
                options: { min: 1 }
            },
            errorMessage: 'Array de itens inválido'
        },
        'listItems.*.taskId': {
            ...BaseValidator.validators.id(new TaskRepository()),
            errorMessage: 'Atividade não encontrada'
        },
        'listItems.*.value': {
            isNumeric: true,
            errorMessage: 'Valor de item inválido'
        }
    };

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
            memberId: ChecklistValidator.model.memberId,
            ...ChecklistValidator.listItemsModel
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ChecklistValidator.validationList({
            ...ChecklistValidator.model,
            ...ChecklistValidator.listItemsModel
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

    /**
     * history
     *
     * @returns Lista de validadores
     */
    public static history(): RequestHandler[] {
        return BaseValidator.validationList({
            memberId: ChecklistValidator.model.memberId,
            order: {
                isIn: {
                    options: [['ascending', 'descending']]
                },
                errorMessage: 'Ordem inválida'
            }
        });
    }
}
