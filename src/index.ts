import express from "express";
import user from "./user/user.router";
const initializeApp = () => {
const app = express();
//middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

user(app);
app.get('/', (req, res) => {
   res.send('Welcome to the Medical API');
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
return app;
}
const app = initializeApp();
export default app;