// Modules
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { checkSchema, Result, Schema, ParamSchema, ValidationError, validationResult, Meta } from 'express-validator';

// Utils
import { StringUtils } from '../utils';

// Routes
import { RouteResponse } from '../routes';

// Repositories
import { BaseRepository } from './database/repository';

/**
 * BaseValidator
 *
 * Classe para tratamentos relacionados aos middlewares de validação de parâmetros
 */
export class BaseValidator {
    /**
     * validators
     *
     * Schema base para validação no controller
     */
    protected static validators: Record<string, ParamSchema> | any = {
        id: (repository: BaseRepository): ParamSchema => {
            return {
                in: ['body', 'params'],
                isMongoId: true, // Não usar em caso de banco diferente do MongoDB
                custom: {
                    options: async (value: string, { req }: Meta) => {
                        const data = await repository.findOne(value);

                        // Usa o nome do repositório para criar o nome de referência. Ex: MemberRepository => MemberRef
                        const refName: string = StringUtils.firstLowerCase(repository.constructor.name.replace('Repository', ''));

                        req.body[`${refName}Ref`] = data;

                        return data ? Promise.resolve() : Promise.reject();
                    }
                },
                errorMessage: 'ID não encontrado'
            };
        },
        name: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            customSanitizer: {
                options: (value: string) => {
                    if (typeof value === 'string') {
                        return StringUtils.firstUpperCase(value);
                    }

                    return undefined;
                }
            },
            errorMessage: 'Nome inválido'
        },
        birthdate: {
            in: 'body',
            isDateString: true,
            matches: {
                options: [
                    /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
                ]
            },
            errorMessage: 'Data de nascimento inválida'
        },
        allowance: {
            in: 'body',
            isNumeric: true,
            errorMessage: 'Mesada invalida'
        }
    };

    /**
     * validationList
     *
     * Retorna o middleware que valida os campos e o que retorna os erros
     *
     * @param schema - Schema com as opções de validação
     *
     * @returns Lista de validadores
     */
    protected static validationList(schema: Schema): RequestHandler[] {
        return [<any>checkSchema(schema), BaseValidator.checkError];
    }

    /**
     * checkError
     *
     * Verifica se existem erros nos parâmetros e da mensagem de erro
     *
     * @param req - Requisição
     * @param res - Resposta da requisição
     * @param next - Callback
     */
    private static checkError(req: Request, res: Response, next: NextFunction): void {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            RouteResponse.error(errors.array(), res);
        } else {
            next();
        }
    }

    /**
     * onlyId
     *
     * Retorna o middleware que valida o ID
     *
     * @param repository - Repositório para manipulação da entidade
     *
     * @returns Lista de validadores
     */
    public static onlyId(repository: BaseRepository): RequestHandler[] {
        return BaseValidator.validationList({ id: BaseValidator.validators.id(repository) });
    }

    /**
     * formatData
     *
     * Formata a data informada do tipo string para um tipo Date
     *
     *
     * @param data Recebe um string com a data para ser formada
     */
    public static formatDate(data: string): Date {
        const dateItems: string[] = data.split('/'); // data recebida no formato dd/MM/yyyy
        const day = Number(dateItems[0]);
        const month = Number(dateItems[1]) - 1;
        const year = Number(dateItems[2]);
        const formatedDate: Date = new Date(year, month, day);
        return formatedDate;
    }
}
