import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity, BeforeInsert } from 'typeorm';
import { EnumListStatus } from '../../../models';

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

    @Column()
    public abscenceCount: number;

    @Column()
    public startDate: Date;

    @Column()
    public closeDate: Date;

    @BeforeInsert()
    public setStatus(): void {
        this.status = EnumListStatus.onHold;
    }

    public setAbscenceCount(): void {
        this.abscenceCount = 0;
    }
}
