import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class ListItem extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public listId: string;

    @Column()
    public taskId: string;

    @Column()
    public status: string;

    @Column()
    public value: number;
}
