import { Entity, ObjectID, ObjectIdColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';

@Entity()
export class Member extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public name: string;

    @Column()
    public birthdate: string;

    @Column()
    public allowance: number;

    @Column()
    public avatar: string;

    @Column()
    public status: boolean;

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
