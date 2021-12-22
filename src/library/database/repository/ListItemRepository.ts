// Modules
import { UpdateResult, DeepPartial, Repository, DeleteResult } from 'typeorm';

// Entities
import { ListItem, Task } from '../entity';

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
     *
     * @returns Resultado da alteração
     */
    public updateStatus(id: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(ListItem).update(id, { abscence: true });
    }

    /**
     * insert
     *
     * Adiciona um item de lista novo
     *
     * @param item - Dados do item
     *
     * @returns Item adicionado
     */
    public insert(item: DeepPartial<ListItem>): Promise<ListItem> {
        const itemRepository: Repository<ListItem> = this.getConnection().getRepository(ListItem);
        return itemRepository.save(itemRepository.create(item));
    }

    /**
     * delete
     *
     * Remove um item de lista pelo ID
     *
     * @param id - ID do item
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(ListItem).delete(id);
    }

    /**
     * findListItems
     *
     * Busca os itens de uma lista de marcação pelo id da lista
     *
     * @param listId - Id da lista
     *
     * @returns Lista de itens buscada
     */
    public findListItems(listId: string): Promise<ListItem[] | undefined> {
        return this.getConnection().getRepository(ListItem).find({ listId });
    }

    /**
     * getDescriptionActivities
     *
     * @returns Todas as atividades cadastradas
     */
    public getDescriptionActivities(): Promise<Task[] | undefined> {
        return this.getConnection()
            .getRepository(Task)
            .find({ relations: ['listItens'] });
    }
}
