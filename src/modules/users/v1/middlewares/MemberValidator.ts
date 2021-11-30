// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';
import * as multer from 'multer';
import { multerConfig } from '../../../../config/multer';

// Repositories
import { MemberRepository } from '../../../../library/database/repository/MemberRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Member } from '../../../../library/database/entity';

/**
 * MemberValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class MemberValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        birthday: BaseValidator.validators.birthday,
        allowance: { in: 'body', isNumeric: true, errorMessage: 'Mesada invalida' },
        id: {
            ...BaseValidator.validators.id(new MemberRepository()),
            errorMessage: 'Membro não encontrado'
        },
        duplicate: {
            errorMessage: 'Membro já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const memberRepository: MemberRepository = new MemberRepository();
                        const member: Member | undefined = await memberRepository.findByName(req.body.name);

                        check = member ? req.body.id === member.id.toString() : true;
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
        return MemberValidator.validationList({
            name: MemberValidator.model.name,
            duplicate: MemberValidator.model.duplicate
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return MemberValidator.validationList({
            id: MemberValidator.model.id,
            ...MemberValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: MemberValidator.model.id
        });
    }
}
