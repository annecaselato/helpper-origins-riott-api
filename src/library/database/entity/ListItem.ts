import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity, BeforeInsert } from 'typeorm';
import { Task } from '.';

@Entity()
export class ListItem extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public listId: string;

    @Column()
    public abscence: boolean;

    @Column()
    public value: number;

    @Column(() => Task)
    task: Task;

    @BeforeInsert()
    public setStatus(): void {
        this.abscence = false;
    }
}
