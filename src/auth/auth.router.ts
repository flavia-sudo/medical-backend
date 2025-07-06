import { Express } from "express";
import { createAdminController, loginUserController, registerUserController, verifyCodeController } from "./auth.controller";

const user = (app: Express) => {
    app.route("/auth/register").post(
        async (req, res, next) => {
            try {
                await registerUserController(req, res);
            } catch (error: any) {
                next(error); //means that if an error occurs, it will be passed to the next middleware, which in this case is the error handler
            }
        }
    )

// create admin route
    app.route("/auth/admin/create").post(
        async (req, res, next) => {
            try {
                await createAdminController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    )

// login user route (works for both users and admins)
    app.route("/auth/login").post(
        async (req, res, next) => {
            try {
                await loginUserController(req, res);
            } catch (error: any) {
                next(error); // Passes the error to the next middleware                            
            }
        }
    )

    app.route("/auth/verify").post(
        async (req, res, next) => {
            try {
                await verifyCodeController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    );
}

export default user;