const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
        info: {
            title: "FEAR API",
            version: "1.0.0",
            description: "The Main API for all FEAR apps (Ekomix, Ekoins, Admin CRM",
        },
};

const options = {
    swaggerDefinition,
    apis: [`../routes/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;