const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'FEAR API',
        description: "API endpoints for FEAR services documented on swagger",
        contact: {
          name: "Garrett Haptonstall <FearDread>",
          email: "ghaptonstall@gmail.com",
          url: "https://github.com/FearDread"
        },
    },
    servers: [
        {
          url: "http://localhost:4000/",
          description: "Local server"
        },
        {
          url: "http://fear.master.com:4000",
          description: "Live server"
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};