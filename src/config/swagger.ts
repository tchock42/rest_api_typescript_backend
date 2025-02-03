import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";
// opciones de swagger
const options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / Sequelize / Typescript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis: ['./src/router.ts']
}
// genera la documentación de swagger con las opciones definidas
const swaggerSpec = swaggerJSDoc(options)   // genera la documentación de swagger con las opciones definidas

const swaggerUiOptions : SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link{
            content: url('https://creacioneswebmx.com/wp-content/uploads/2024/10/logo-147x147.jpg');
            max-width: 90px;
            width: 90px;
        }
        .swagger-ui .topbar{
            background: linear-gradient(35deg, rgb(6, 0, 151) 0%, rgb(130, 4, 255) 73%, rgb(193, 15, 255) 100%);
        }
        .swagger-ui .topbar a{      
            max-width: 90px;
        }
    `,
    customSiteTitle: 'Documentación REST aPI Express / Typescript' // cambio del title de documentacion
}
// exporta la documentación de swagger
export default swaggerSpec;
export {
    swaggerUiOptions
}