import { Express, Response, Request, NextFunction } from 'express';
import { createUserController, deleteUserController, getUserByIdController, getUsersController, updateUserByIdController, getDoctorsController } from './user.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';
import { is } from 'drizzle-orm';

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
        // isAuthenticated,
        // isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getUsersController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    // get user by id
    app.route('/user/:userId').get(
        isAuthenticated,
        isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getUserByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update user by id
    app.route('/user/:userId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updateUserByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    // delete user by id
    app.route('/user/:userId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteUserController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get doctors
    app.route('/users/doctors_all').get(
        isAuthenticated,
        // isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getDoctorsController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default user