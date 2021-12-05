// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Get, Middlewares, Post, Put, Patch } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Task } from '../../../../library/database/entity';

// Repositories
import { TaskRepository } from '../../../../library/database/repository';

// Validators
import { TaskValidator } from '../middlewares/TaskValidator';

@Controller(EnumEndpoints.TASK_V1)
export class TaskController extends BaseController {
    /**
     * @swagger
     * /v1/task:
     *   get:
     *     summary: Lista as atividades
     *     tags: [Tasks]
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
        const [rows, count] = await new TaskRepository().list<Task>(TaskController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/task:
     *   post:
     *     summary: Cadastra uma atividade
     *     tags: [Tasks]
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
     *               description: taskDescription
     *             required:
     *               - description
     *             properties:
     *               description:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(TaskValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newTask: DeepPartial<Task> = {
            description: req.body.description
        };

        await new TaskRepository().insert(newTask);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/task:
     *   put:
     *     summary: Altera uma atividade
     *     tags: [Tasks]
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
     *               id: taskId
     *               description: taskDescription
     *             required:
     *               - id
     *               - description
     *             properties:
     *               id:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @Middlewares(TaskValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const task: Task = req.body.taskRef;

        task.description = req.body.description;

        await new TaskRepository().update(task);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/task/{taskId}:
     *   patch:
     *     summary: Apaga uma atividade
     *     tags: [Tasks]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: taskId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Patch('/:id')
    @Middlewares(TaskValidator.onlyId())
    public async hide(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new TaskRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
