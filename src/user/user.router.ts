import { Express, Response, Request, NextFunction } from 'express';
import { createUserController, getUsersController } from './user.controller';

const user = (app: Express) => {
    //create user
    app.route('/user').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createUserController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all users
    app.route('/user_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getUsersController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}