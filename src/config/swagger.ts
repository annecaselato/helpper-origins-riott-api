import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'RIOTT API',
            version: '1.0.0'
        },
        host: 'localhost:4444'
    },
    apis: ['src/library/third-party/swagger/**/*.ts', 'src/modules/**/*.ts']
};
