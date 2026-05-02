// swagger_config.js
const swaggerJsdoc = require('swagger-jsdoc');
const options = {

  definition: {

    openapi: '3.0.0',

    info: {

      title: 'MeetMux Platform API',

      version: '1.0.0',

      description:
        'API Documentation for MeetMux Activity Platform'
    },

    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },

  apis: ['./routes/*.js']
};

const swaggerSpec =
  swaggerJsdoc(options);

module.exports = swaggerSpec;