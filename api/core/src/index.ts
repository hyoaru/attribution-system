import dotenv from "dotenv";
import { app } from "./instances";
import bodyParser from "body-parser";
import { swaggerUi, specs } from "./configurations/swagger/swagger";
import { router as routerAuth } from "./routes/authentication";
import { router as routerAttribution } from "./routes/attribution";
import cors from "cors";

export const createApp = () => {
  dotenv.config();

  app.use(bodyParser.json());
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:8003",
        "https://attribution-system.org",
      ],
      credentials: true,
    }),
  );

  app.use("/authentication", routerAuth);
  app.use("/attributions", routerAttribution);

  // Set up Swagger UI
  app.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: ".swagger-ui .topbar { display: none; }",
    }),
  );

  return app;
};
