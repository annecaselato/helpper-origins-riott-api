// Modules
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';

// Entities
import { Checklist } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * ChecklistRepository
 *
 * Repositório para tabela de listas de marcação
 */
export class ChecklistRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Checklist;
    }

    /**
     * insert
     *
     * Adiciona uma lista de marcação nova
     *
     * @param checklist - Dados da lista
     *
     * @returns Lista adicionada
     */
    public insert(checklist: DeepPartial<Checklist>): Promise<Checklist> {
        const checklistRepository: Repository<Checklist> = this.getConnection().getRepository(Checklist);
        return checklistRepository.save(checklistRepository.create(checklist));
    }

    /**
     * update
     *
     * Altera uma lista de marcação
     *
     * @param checklist - Dados da lista
     *
     * @returns Lista alterada
     */
    public update(checklist: Checklist): Promise<Checklist> {
        return this.getConnection().getRepository(Checklist).save(checklist);
    }

    /**
     * delete
     *
     * Remove uma lista de marcação pelo ID
     *
     * @param id - ID da lista
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Checklist).delete(id);
    }

    /**
     * updateCount
     *
     * Altera o valor da contagem de faltas da lista
     *
     * @param id - ID da lista
     * @param count - Numero de faltas
     *
     * @returns Resultado da alteração
     */
    public updateCount(id: string, count: number): Promise<UpdateResult> {
        return this.getConnection().getRepository(Checklist).update(id, { abscenceCount: count });
    }

    /**
     * findByMemberAndStatus
     *
     * Busca uma lista de marcação pela id do membro e o status da lista
     *
     * @param memberId - Id do membro
     *
     * @param status - Status da lista
     *
     * @returns Lista buscada
     */
    public findByMemberAndStatus(memberId: string, status: string): Promise<Checklist[]> {
        return this.getConnection().getRepository(Checklist).find({ memberId, status });
    }
}
