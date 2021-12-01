// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { Checklist } from '../entity';

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
     * Adiciona uma lista de marcaação nova
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
     * update
     *
     * Altera uma lista de marcaação
     *
     * @param checklist - Dados da lista de marcaação
     *
     * @returns Lista de marcaação alterada
     */
    public update(checklist: Checklist): Promise<Checklist> {
        return this.getConnection().getRepository(Checklist).save(checklist);
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
     * findByName
     *
     * Busca uma lista de marcação pelo nome
     *
     * @param name - Nome da lista de marcação
     *
     * @returns Lista de marcação buscada
     */
    public findByName(name: string): Promise<Checklist | undefined> {
        return this.getConnection().getRepository(Checklist).findOne({ name });
    }
}
