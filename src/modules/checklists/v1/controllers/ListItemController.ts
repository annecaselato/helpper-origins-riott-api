// Modules
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Patch, Middlewares } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Repositories
import { ListItemRepository } from '../../../../library/database/repository';

// Validators
import { ListItemValidator } from '../middlewares/ListItemValidator';

@Controller(EnumEndpoints.LISTITEM_V1)
export class ListItemController extends BaseController {
    /**
     * @swagger
     * /v1/listItem/{listItemId}:
     *   patch:
     *     summary: Marca a falta no item da lista
     *     tags: [ListItems]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: listItemId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Patch('/:id')
    @Middlewares(ListItemValidator.onlyId())
    public async markAbscence(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new ListItemRepository().updateStatus(id);

        RouteResponse.success({ id }, res);
    }
}
