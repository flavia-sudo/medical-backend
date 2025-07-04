import express from "express";
import user from "./user/user.router";
import doctor from "./doctor/doctor.router";
import appointment from "./appointment/appointment.router";
import payment from "./payment/payment.router";
import complaint from "./complaints/complaint.router";
import transaction from "./transaction/transaction.router";
import prescription from "./prescription/prescription.router";
const initializeApp = () => {
const app = express();
//middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

user(app);
doctor(app);
appointment(app);
payment(app);
transaction(app);
prescription(app);
complaint(app);

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