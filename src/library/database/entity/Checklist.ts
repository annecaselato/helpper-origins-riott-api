import { Entity, ObjectID, ObjectIdColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';

@Entity()
export class Checklist extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public memberId: string;

    @Column({ unique: true })
    public name: string;

    @Column()
    public status: string;

    @Column()
    public initialAllowance: number;

    @Column()
    public deduction: number;

    @Column()
    public finalAllowance: number;

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

    @BeforeInsert()
    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }
}
