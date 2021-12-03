// Modules
import { DeepPartial, ObjectID } from 'typeorm';
import { Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { Body, UploadedFile, UseInterceptors, Req, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

// Library
import { extname } from 'path';
import { param } from 'express-validator';
import { Helper } from '../../../../config/multer';
import { BaseController, BaseValidator, Logger } from '../../../../library';

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
import { MemberValidator } from '../middlewares/MemberValidator';

const SERVER_URL = 'http://localhost:4444/';

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

        RouteResponse.success({ rows, count }, res);
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
            allowance: req.body.allowance
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
     *     requestBody:
     *       content:
     *          image/jpg:
     *              schema:
     *                  type: string
     *                  format: binary
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post('/:id/avatar')
    @PublicRoute()
    @ApiConsumes('multipart/form-data')
    @Middlewares(MemberValidator.onlyId())
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
        new Logger().log(file);
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

        await new MemberRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
