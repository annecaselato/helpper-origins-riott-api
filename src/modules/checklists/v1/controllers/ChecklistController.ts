// Modules
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Middlewares, Get, Patch, Delete } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

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
     * /v1/checklist:
     *   get:
     *     summary: Retorna a lista de marcação ativa
     *     tags: [Checklists]
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
     *               memberId: memberId
     *               status: listStatus
     *             required:
     *               - memberId
     *               - status
     *             properties:
     *               memberId:
     *                 type: string
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    public async getList(req: Request, res: Response): Promise<void> {
        const repository: ChecklistRepository = new ChecklistRepository();

        const checklist: Checklist | undefined = await repository.findByStatus(req.body.status);
    }

    @Patch('/:id')
    public async closeList(req: Request, res: Response): Promise<void> {
        const repository: ChecklistRepository = new ChecklistRepository();
        const checklist: Checklist | undefined = await repository.findByStatus(req.body.status);
    }

    /**
     * @swagger
     * /v1/checklist/{checklistId}:
     *   delete:
     *     summary: Apaga uma lista de marcação aberta definitivamente
     *     tags: [Checklists]
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
    @Delete('/:id')
    @Middlewares(ChecklistValidator.delete())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new ChecklistRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
