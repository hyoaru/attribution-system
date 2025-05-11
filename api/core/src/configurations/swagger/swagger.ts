import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { components } from "./components";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Attribution System API",
      version: "1.0.0",
      description: "API documentation for the attribution system",
    },
    components: components,
  },

  apis: ["**/*.ts"],
};

// Initialize Swagger definition
const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
