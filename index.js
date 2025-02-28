import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./Database/database.js";
import {userAuthRouter} from "./routes/authentication.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

DB();
app.use(userAuthRouter)

app.get("Hello world", (req, res) => {
    res.send("Hello");
})

app.listen(process.env.PORT, () => console.log("Server running on PORT", process.env.PORT));