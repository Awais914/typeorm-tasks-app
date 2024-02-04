import cors = require("cors");
import helmet from "helmet";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import "dotenv/config";

import { AppDataSource } from "./data-source";
import routes from "./routes";
import swaggerOptions from "./swaggerOptions";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use("/", routes);
    app.listen(3000);

    console.log(`Express server has started on port: ${process.env.PORT}`);
  })
  .catch((error) => console.log(error));
