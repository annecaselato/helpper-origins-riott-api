// Modules
import { Router, Request, Response, NextFunction } from 'express';

// Middlewares
import { AuthMiddleware } from '../modules/users/v1';

// Models
import { EnumDecorators, IRouteDef } from '../models';

export declare type TClass<T = any> = new (...args: any[]) => T;

/**
 * RoutesController
 *
 * Classe responsável por gerenciar os controllers e exportar as rotas
 */
export class RoutesController {
    /**
     * exportRoutes
     *
     * Exporta todos os métodos com os decorators de rest
     *
     * @param controllers - Lista de controllers
     *
     * @returns Router group do express
     */
    public static exportRoutes(controllers: TClass[]): Router {
        const router: Router = Router();

        // Percorre lista de controllers para adicionar todas as rotas
        controllers.forEach((Controller: TClass<any>) => {
            const instance = new Controller();
            const prefix = Reflect.getMetadata(EnumDecorators.CONTROLLER_PREFIX, Controller);
            const publicRoutes: Array<string | symbol> = Reflect.getMetadata(EnumDecorators.PUBLIC_ROUTES, Controller) || [];
            const routes: IRouteDef[] = Reflect.getMetadata(EnumDecorators.ROUTES, Controller);
            const allMiddlewares: any = Reflect.getMetadata(EnumDecorators.MIDDLEWARE, Controller) || {};

            routes.forEach((route: IRouteDef) => {
                const methodMiddlewares: any[] = allMiddlewares[route.methodName] || [];
                if (!publicRoutes.includes(route.methodName)) {
                    methodMiddlewares.unshift(AuthMiddleware.auth);
                }
                router[route.requestMethod](prefix + route.path, [...methodMiddlewares, this.runAsyncWrapper(instance[route.methodName])]);
            });
        });

        return router;
    }

    /**
     * runAsyncWrapper
     *
     * Valida middleware de erro em todas as rotas mesmo que assíncronas
     * @see https://stackoverflow.com/a/51391081/11717458
     *
     * @param callback - Função de callback
     * @returns
     */
    private static runAsyncWrapper(callback: any): any {
        return (req: Request, res: Response, next: NextFunction) => callback(req, res, next).catch(next);
    }
}
