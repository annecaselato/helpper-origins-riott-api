import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity, BeforeInsert, ManyToMany } from 'typeorm';
import { ListItem } from '.';

@Entity()
export class Task extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column({ unique: true })
    public description: string;

    @Column()
    public isDeleted: boolean;

    @BeforeInsert()
    public setDeleted(): void {
        this.isDeleted = false;
    }

    @ManyToMany(() => ListItem, listitem => listitem.tasks)
    listitens: ListItem[];
}
