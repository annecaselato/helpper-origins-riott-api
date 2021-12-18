// Modules
import { DeepPartial, ObjectID } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Middlewares, Get, Patch, Post, Put, Delete } from '../../../../decorators';

// Models
import { EnumEndpoints, EnumListStatus } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Checklist, ListItem, Member } from '../../../../library/database/entity';

// Repositories
import { ChecklistRepository, ListItemRepository } from '../../../../library/database/repository';

// Validators
import { ChecklistValidator } from '../middlewares/ChecklistValidator';

@Controller(EnumEndpoints.CHECKLIST_V1)
export class ChecklistController extends BaseController {
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
     *               listItems: [{taskId1: taskId, value1: 20}, {taskId2: taskId, value2: 10}]
     *             required:
     *               - name
     *               - memberId
     *               - listItems
     *             properties:
     *               name:
     *                 type: string
     *               memberId:
     *                 type: string
     *               listItems:
     *                 type: array
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(ChecklistValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const onHoldList: Checklist[] | undefined = await new ChecklistRepository().findByMemberAndStatus(req.body.memberId, EnumListStatus.onHold);
        const activeList: Checklist[] | undefined = await new ChecklistRepository().findByMemberAndStatus(req.body.memberId, EnumListStatus.active);

        if (onHoldList || activeList) {
            RouteResponse.error('Membro já possui uma lista em espera ou em andamento', res);
        } else {
            const newChecklist: DeepPartial<Checklist> = {
                name: req.body.name,
                memberId: req.body.memberId
            };

            const listId: ObjectID = (await new ChecklistRepository().insert(newChecklist)).id;

            const newItems: ListItem[] = req.body.listItems;

            newItems.forEach(async (element: ListItem) => {
                const newItem: DeepPartial<ListItem> = {
                    listId: listId.toString(),
                    taskId: element.taskId,
                    value: element.value
                };

                await new ListItemRepository().insert(newItem);
            });

            RouteResponse.successCreate(res);
        }
    }

    /**
     * @swagger
     * /v1/checklist:
     *   put:
     *     summary: Altera uma lista de marcação
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
     *               id: checklistId
     *               name: checklistName
     *               memberId: checklistMember
     *               listItems: [{taskId1: taskId, value1: 20}, {taskId2: taskId, value2: 10}]
     *             required:
     *               - id
     *               - name
     *               - memberId
     *               - listItems
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               memberId:
     *                 type: string
     *               listItems:
     *                 type: array
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @Middlewares(ChecklistValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const checklist: Checklist = req.body.checklistRef;

        if (checklist.status !== EnumListStatus.onHold) {
            RouteResponse.error('Apenas listas em espera podem ser editadas', res);
        } else {
            checklist.name = req.body.name;
            checklist.memberId = req.body.memberId;

            await new ChecklistRepository().update(checklist);

            const listItems: ListItem[] | undefined = await new ListItemRepository().findListItems(checklist.id.toString());

            listItems?.forEach(async (element: ListItem) => {
                await new ListItemRepository().delete(element.id.toString());
            });

            const newItems: ListItem[] | undefined = req.body.listItems;

            newItems?.forEach(async (element: ListItem) => {
                const newItem: DeepPartial<ListItem> = {
                    listId: checklist.id.toString(),
                    taskId: element.taskId,
                    value: element.value
                };

                await new ListItemRepository().insert(newItem);
            });

            RouteResponse.successEmpty(res);
        }
    }

    /**
     * @swagger
     * /v1/checklist/{checklistId}:
     *   delete:
     *     summary: Apaga uma lista de marcação definitivamente
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
    @Delete('/:id')
    @Middlewares(ChecklistValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const checklist: Checklist = req.body.checklistRef;

        if (checklist.status !== EnumListStatus.onHold) {
            RouteResponse.error('Apenas listas em espera podem ser deletadas', res);
        } else {
            const listItems: ListItem[] | undefined = await new ListItemRepository().findListItems(id.toString());

            listItems?.forEach(async (element: ListItem) => {
                await new ListItemRepository().delete(element.id.toString());
            });

            await new ChecklistRepository().delete(id);

            RouteResponse.success({ id }, res);
        }
    }

    /**
     * @swagger
     * /v1/checklist/start/{checklistId}:
     *   patch:
     *     summary: Inicia uma lista de marcação
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
    @Patch('/start/:id')
    @Middlewares(ChecklistValidator.onlyId())
    public async start(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const checklist: Checklist = req.body.checklistRef;

        if (checklist.status !== EnumListStatus.onHold) {
            RouteResponse.error('Apenas listas em espera podem ser iniciadas', res);
        } else {
            checklist.status = EnumListStatus.active;
            checklist.startDate = new Date();

            await new ChecklistRepository().update(checklist);
            RouteResponse.success({ id }, res);
        }
    }

    /**
     * @swagger
     * /v1/checklist/active/{memberId}:
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
    @Get('/active/:memberId')
    @Middlewares(ChecklistValidator.memberId())
    public async getActive(req: Request, res: Response): Promise<void> {
        const { memberId } = req.params;
        const member: Member = req.body.memberRef;

        const activeList: Checklist[] | undefined = await new ChecklistRepository().findByMemberAndStatus(memberId, EnumListStatus.active);

        if (!activeList) {
            RouteResponse.error('Nenhuma lista em andamento', res);
        } else {
            const listItems: ListItem[] | undefined = await new ListItemRepository().findListItems(activeList[0].id.toString());

            const abscenceItems: ListItem[] | undefined = listItems?.filter(obj => obj.abscence === false);

            let discount = 0;
            if (abscenceItems) {
                discount = abscenceItems.reduce((acc, curr) => acc + curr.value, 0);

                const abscenceCount = abscenceItems.length;
                await new ChecklistRepository().updateCount(activeList[0].id.toString(), abscenceCount);
            }
            const total = member.allowance - discount;
            RouteResponse.success({ activeList, listItems, discount, total }, res);
        }
    }

    /**
     * @swagger
     * /v1/checklist/close/{checklistId}:
     *   patch:
     *     summary: Encerra uma lista de marcação
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
    @Patch('/close/:id')
    @Middlewares(ChecklistValidator.onlyId())
    public async close(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const checklist: Checklist = req.body.checklistRef;

        if (checklist.status !== EnumListStatus.active) {
            RouteResponse.error('Apenas listas em andamento podem ser encerradas', res);
        } else {
            checklist.status = EnumListStatus.closed;
            checklist.closeDate = new Date();

            await new ChecklistRepository().update(checklist);
            RouteResponse.success({ id }, res);
        }
    }

    /**
     * @swagger
     * /v1/checklist/closed/{memberId}:
     *   get:
     *     summary: Retorna informações das listas encerradas de um membro
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
    @Get('/closed/:memberId')
    @Middlewares(ChecklistValidator.memberId())
    public async getClosed(req: Request, res: Response): Promise<void> {
        const { memberId } = req.params;
        const closedLists: Checklist[] | undefined = await new ChecklistRepository().findByMemberAndStatus(memberId, EnumListStatus.closed);

        if (!closedLists) {
            RouteResponse.error('Nenhuma lista encerrada', res);
        } else {
            RouteResponse.success(closedLists, res);
        }
    }

    /**
     * @swagger
     * /v1/checklist:
     *   get:
     *     summary: Lista as listas de marcação
     *     tags: [Checklists]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new ChecklistRepository().list<Checklist>(ChecklistController.listParams(req));
        RouteResponse.success({ rows, count }, res);
    }
}
