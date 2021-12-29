import { ObjectID } from 'typeorm';

export interface IListItems {
    [x: string]: any;
    taskId: string | ObjectID;
    value: number;
}
