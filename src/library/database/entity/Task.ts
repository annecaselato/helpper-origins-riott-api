import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Task extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column({ unique: true })
    public description: string;
}
