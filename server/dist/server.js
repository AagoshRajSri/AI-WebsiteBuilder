import express from "express";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
const app = express();
const port = 3000;
const corsOption = {
    origin: process.env.TRUSTED_ORIGINS?.split(",").filter(Boolean) || ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
};
app.use(cors(corsOption));
app.use(express.json({ limit: "50mb" }));
const authHandler = toNodeHandler(auth);
// Mount all auth routes with regex to match /api/auth and all sub-paths
app.all(/^\/api\/auth(\/.*)?$/, (req, res) => {
    return authHandler(req, res);
});
app.get("/", (req, res) => {
    res.send("Server is Live!");
});
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
