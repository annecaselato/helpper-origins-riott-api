import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Checklist extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public memberId: string;

    @Column()
    public name: string;

    @Column()
    public status: string;
}
