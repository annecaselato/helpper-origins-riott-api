// Modules
import 'reflect-metadata';

// Models
import { EnumDecorators } from '../models';

export const PrivateRoute = (): any => {
    return (target: any, propertyKey: string | symbol) => {
        const privateRoutes: Array<string | symbol> = Reflect.getMetadata(EnumDecorators.PRIVATE_ROUTES, target.constructor) || [];

        privateRoutes.push(propertyKey);

        Reflect.defineMetadata(EnumDecorators.PRIVATE_ROUTES, privateRoutes, target.constructor);
    };
};
