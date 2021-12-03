// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Middlewares, Get, Patch, Post } from '../../../../decorators';

// Models
import { EnumEndpoints, EnumListStatus } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Checklist } from '../../../../library/database/entity';

// Repositories
import { ChecklistRepository } from '../../../../library/database/repository';

// Validators
import { ChecklistValidator } from '../middlewares/ChecklistValidator';

@Controller(EnumEndpoints.CHECKLIST_V1)
export class ChecklistController extends BaseController {
    /**
     * @swagger
     * /v1/checklist/{memberId}:
     *   get:
     *     summary: Retorna informações da lista ativa de um membro
     *     tags: [Checklists]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:memberId')
    @Middlewares(ChecklistValidator.memberId())
    public async getActive(req: Request, res: Response): Promise<void> {
        const { memberId } = req.params;
        const activeList = await new ChecklistRepository().findByMemberAndStatus(memberId, EnumListStatus.active);

        RouteResponse.success({ activeList }, res);
    }

    /**
     * @swagger
     * /v1/checklist/{checklistId}:
     *   patch:
     *     summary: Altera o status da lista de marcação para Fechada
     *     tags: [Checklists]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: checklistId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Patch('/:id')
    @Middlewares(ChecklistValidator.onlyId())
    public async close(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new ChecklistRepository().updateStatus(id, EnumListStatus.closed);

        RouteResponse.success({ id }, res);
    }

    /**
     * @swagger
     * /v1/checklist:
     *   post:
     *     summary: Cadastra uma lista de marcação
     *     tags: [Checklists]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               name: checklistName
     *               memberId: checklistMember
     *             required:
     *               - name
     *               - memberId
     *             properties:
     *               name:
     *                 type: string
     *               memberId:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(ChecklistValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newChecklist: DeepPartial<Checklist> = {
            name: req.body.name,
            memberId: req.body.memberId,
            status: EnumListStatus.onHold
        };

        await new ChecklistRepository().insert(newChecklist);

        RouteResponse.successCreate(res);
    }
}
