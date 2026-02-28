import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { stripeWebHook } from "./controllers/stripeWebhook.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const corsOption = {
  origin: process.env.TRUSTED_ORIGINS?.split(",").filter(Boolean) || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOption));
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebHook
);

app.use(express.json({ limit: "50mb" }));

const authHandler = toNodeHandler(auth);

// Mount all auth routes with regex to match /api/auth and all sub-paths
app.all(/^\/api\/auth(\/.*)?$/, (req: Request, res: Response) => {
  return authHandler(req, res);
});

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
  });
}

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
