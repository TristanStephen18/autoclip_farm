import express from "express";
import cors from "cors";
import ytRoute from "./routes/apis/yt.ts";
import AiClipperRoute from "./routes/apis/gemini.ts";
import path from "path";
import dotenv from 'dotenv';



const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

app.use("/yt", ytRoute);
app.use("/ai", AiClipperRoute);

//static routes
app.use(
  "/videos",
  express.static(path.join(process.cwd(), "./server/public/videos"))
);

app.get("/hello", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(3000, () => {
  console.log(path.join(process.cwd(), './server/public/videos'));
  console.log("server is listening");
});
