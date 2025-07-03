import express from "express";
import user from "./user/user.router";
const initializeApp = () => {
const app = express();
//middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

user(app);
return app;
}