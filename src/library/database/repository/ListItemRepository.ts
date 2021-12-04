// Modules
import { UpdateResult } from 'typeorm';

// Entities
import { ListItem } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * UserRepository
 *
 * Repositório para tabela de usuários
 */
export class ListItemRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = ListItem;
    }

    /**
     * updateStatus
     *
     * Altera o status do item pelo id
     *
     * @param id - ID do item
     * @param status - Novo status do item
     *
     * @returns Resultado da alteração
     */
    public updateStatus(id: string, status: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(ListItem).update(id, { status });
    }
}
