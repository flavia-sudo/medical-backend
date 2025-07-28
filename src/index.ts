import express from "express";
import user from "./user/user.router";
import appointment from "./appointment/appointment.router";
import payment from "./payment/payment.router";
import complaint from "./complaints/complaint.router";
import transaction from "./transaction/transaction.router";
import prescription from "./prescription/prescription.router";
import auth from "./auth/auth.router";
import cors from "cors";
const initializeApp = () => {
const app = express();
//middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

auth(app);
user(app);
appointment(app);
payment(app);
transaction(app);
prescription(app);
complaint(app);

app.get('/', (req, res) => {
   res.send('Welcome to the Medical API');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on https://medical-backend-v1wz.onrender.com");
});
return app;
}
const app = initializeApp();
export default app;