import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import { Task } from './Task';

@Entity()
export class ListItem extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public listId: string;

    @Column()
    public taskId: string;

    @Column()
    public abscence: boolean;

    @Column()
    public value: number;

    @BeforeInsert()
    public setStatus(): void {
        this.abscence = false;
    }

    @ManyToMany(() => Task, task => task.listitens)
    @JoinTable()
    tasks: Task[];
}
