// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

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
     * Remove uma atividade pelo ID
     *
     * @param id - ID da atividade
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Task).delete(id);
    }
}
