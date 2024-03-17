import express from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import handleGlobalError from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
const app = express();

const allowedOrigins = ["http://localhost:5173"];

//parser

app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());

// application routes
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is running 😊 ^_~ OK !");
});

// global error handler

app.use(handleGlobalError);

// not found

app.use(notFound);

export default app;
