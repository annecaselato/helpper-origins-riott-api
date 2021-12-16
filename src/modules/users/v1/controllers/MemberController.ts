// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Library
import { BaseController, BaseValidator } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Member } from '../../../../library/database/entity';

// Repositories
import { MemberRepository } from '../../../../library/database/repository';

// Validators
import { MemberValidator } from '../middlewares/UserValidator';

// Multer
import { multerConfig } from '../../../../config/multer';

const upload = multer(multerConfig).single('file');

@Controller(EnumEndpoints.MEMBER)
export class MemberController extends BaseController {
    /**
     * @swagger
     * /v1/member:
     *   get:
     *     summary: Lista os membros da família
     *     tags: [Members]
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
    @PublicRoute()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new MemberRepository().list<Member>(MemberController.listParams(req));

        const rowsActiveMember = rows.filter(member => member.status === true);

        RouteResponse.success({ rowsActiveMember, count }, res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}:
     *   get:
     *     summary: Retorna informações de um membro da família
     *     tags: [Members]
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
    @Get('/:id')
    @PublicRoute()
    @Middlewares(MemberValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.memberRef }, res);
    }

    /**
     * @swagger
     * /v1/member/avatar/{memberId}:
     *   get:
     *     summary: Retorna avatar de um membro da família
     *     tags: [Members]
     *     produces:
     *       - image/jpg
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *        '200':
     *            description: Avatar image in PNG format
     *            content:
     *              image/png:
     *                  schema:
     *                     type: object
     *                     properties:
     *                          type: string
     *                          format: binary
     *        '403':
     *            description: Avatar image is not uploaded
     */
    @Get('/avatar/:id')
    @PublicRoute()
    @Middlewares(MemberValidator.onlyId())
    public async getImageMember(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const member: Member | undefined = await new MemberRepository().findOne(id);

        const options = {
            root: path.join(__dirname, '../../../../avatars/')
        };

        const filename = `${member?.avatar}`;

        res.sendFile(filename, options, err => {
            if (err) {
                res.status(403).send('Desculpe! Imagem não pode ser carregada');
            }
        });
    }

    /**
     * @swagger
     * /v1/member:
     *   post:
     *     summary: Cadastra um novo membro da família
     *     tags: [Members]
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
     *               name: memberName
     *               birthdate: dd/MM/yyyy
     *               allowance: 999.99
     *             required:
     *               - name
     *               - birthdate
     *             properties:
     *               name:
     *                 type: string
     *               birthdate:
     *                 type: date
     *               allowance:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(MemberValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const formatedDate: Date = BaseValidator.formatDate(req.body.birthdate);

        const newMember: DeepPartial<Member> = {
            name: req.body.name,
            birthdate: formatedDate,
            allowance: req.body.allowance,
            status: true
        };

        await new MemberRepository().insert(newMember);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}/avatar:
     *   post:
     *     summary: Envia arquivo de foto
     *     tags: [Members]
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       content:
     *          multipart/form-data:
     *              schema:
     *                  type: object
     *                  properties:
     *                     file:
     *                        type: string
     *                        format: binary
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post('/:id/avatar')
    @PublicRoute()
    @Middlewares(MemberValidator.onlyId())
    public async uploadFile(req: Request, res: Response): Promise<void> {
        upload(req, res, async (err: any) => {
            if (err) {
                RouteResponse.error('Falha ao salvar imagem', res);
            } else if (req.file === undefined) {
                RouteResponse.error('Nenhum arquivo encontrado', res);
            } else {
                const { id } = req.params;
                await new MemberRepository().setAvatar(id, req.file?.filename);
                RouteResponse.successCreate(res);
            }
        });
    }

    /**
     * @swagger
     * /v1/member:
     *   put:
     *     summary: Altera um membro da família
     *     tags: [Members]
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
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               id: memberId
     *               name: memberName
     *               birthdate: dd/MM/yyyy
     *               allowance: 999.99
     *             required:
     *               - id
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               birthdate:
     *                 type: date
     *               allowance:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(MemberValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const member: Member = req.body.memberRef;

        const formatedDate: Date = BaseValidator.formatDate(req.body.birthdate);

        member.name = req.body.name;
        member.birthdate = formatedDate;
        member.allowance = req.body.allowance;

        await new MemberRepository().update(member);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}:
     *   delete:
     *     summary: Apaga um membro da família definitivamente
     *     tags: [Members]
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
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(MemberValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const member: Member | undefined = await new MemberRepository().findOne(id);

        if (typeof member === 'undefined') {
            RouteResponse.notFound(req, res);
        } else {
            member.status = false;
            await new MemberRepository().update(member);
            RouteResponse.success({ id }, res);
        }
    }
}
