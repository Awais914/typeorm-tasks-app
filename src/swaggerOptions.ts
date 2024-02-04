const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express Tasks App",
      version: "1.0.0",
      description:
        "Taska CRUD API made with TypeORM, Express and documented with Swagger",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
