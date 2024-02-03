const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express Tasks App",
      version: "1.0.0",
      description: "Taska CRUD API made with TypeORM, Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/controllers/*.ts"],
};

export default swaggerOptions;
