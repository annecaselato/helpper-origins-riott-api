// Modules
import { DeepPartial, Repository, UpdateResult } from 'typeorm';

// Entities
import { Task } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * TaskRepository
 *
 * Repositório para tabela de atividades
 */
export class TaskRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Task;
    }

    /**
     * insert
     *
     * Adiciona uma nova atividade
     *
     * @param task - Dados da atividade
     *
     * @returns Atividade adicionada
     */
    public insert(task: DeepPartial<Task>): Promise<Task> {
        const taskRepository: Repository<Task> = this.getConnection().getRepository(Task);
        return taskRepository.save(taskRepository.create(task));
    }

    /**
     * update
     *
     * Altera uma atividade
     *
     * @param task - Dados da atividade
     *
     * @returns Atividade alterada
     */
    public update(task: Task): Promise<Task> {
        return this.getConnection().getRepository(Task).save(task);
    }

    /**
     * delete
     *
     * Altera estado de removida da atividade pelo id
     *
     * @param id - ID da atividade
     *
     * @returns Resultado da alteração
     */
    public delete(id: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(Task).update(id, { isDeleted: true });
    }

    /**
     * findByDescription
     *
     * Busca uma atividade pela descrição
     *
     * @param description - Descrição da atividade
     *
     * @returns Atividade buscada
     */
    public findByDescription(description: string): Promise<Task | undefined> {
        return this.getConnection().getRepository(Task).findOne({ description });
    }
}
