// Modules
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Patch } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Repositories
import { ListItemRepository } from '../../../../library/database/repository';

@Controller(EnumEndpoints.CHECKLIST_V1)
export class ListItemController extends BaseController {
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
    public async check(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new ListItemRepository().updateStatus(id, 'checked');

        RouteResponse.success({ id }, res);
    }
}
