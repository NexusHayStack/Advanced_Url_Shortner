import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Specifies the OpenAPI version
    info: {
      title: "URL Shortner", // API title
      description: "API Documentation for your app", // API description
      version: "1.0.0", // API version
    },
    servers: [
      {
        url: "http://localhost:5000", // Base URL of your API
        description: "Development Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the files containing Swagger comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;
