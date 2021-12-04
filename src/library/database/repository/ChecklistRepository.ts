// Modules
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';

// Entities
import { Checklist, ListItem } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * UserRepository
 *
 * Repositório para tabela de usuários
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
     * @param checklist - Dados da lista de marcação
     *
     * @returns Lista de marcação adicionada
     */
    public insert(checklist: DeepPartial<Checklist>): Promise<Checklist> {
        const checklistRepository: Repository<Checklist> = this.getConnection().getRepository(Checklist);
        return checklistRepository.save(checklistRepository.create(checklist));
    }

    /**
     * delete
     *
     * Remove uma lista de marcação pelo ID
     *
     * @param id - ID da lista de marcação
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Checklist).delete(id);
    }

    /**
     * updateStatus
     *
     * Altera o status da lista de marcaação pelo id da lista
     *
     * @param id - ID da lista de marcação
     * @param status - Novo status da lista de marcação
     *
     * @returns Resultado da alteração
     */
    public updateStatus(id: string, status: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(Checklist).update(id, { status });
    }

    /**
     * findByMemberAndStatus
     *
     * Busca uma lista de marcação pela id do membro e o status da lista
     *
     * @param memberId - Id do membro com a lista de marcação
     *
     * @param status - Status da lista de marcação
     *
     * @returns Lista de marcação buscada
     */
    public findByMemberAndStatus(memberId: string, status: string): Promise<Checklist[] | undefined> {
        return this.getConnection().getRepository(Checklist).find({ memberId, status });
    }

    /**
     * findListItems
     *
     * Busca os itens de uma lista de marcação pelo id da lista
     *
     * @param listId - Id do membro com a lista de marcação
     *
     * @returns Lista de itens buscada
     */
    public findListItems(listId: string): Promise<ListItem[] | undefined> {
        return this.getConnection().getRepository(ListItem).find({ listId });
    }
}
