import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity, BeforeInsert } from 'typeorm';

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
}
