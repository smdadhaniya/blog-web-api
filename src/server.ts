import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { connectDatabase } from "./config/database";
import blogRoutes from "./routes/blog-routes";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.use("/api", blogRoutes);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("[Info] Database connection successful");
    app.listen(port, () => {
      console.log(`[Info] Server running at PORT:${port}`);
    });
  } catch (error) {
    console.error("[Error] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
