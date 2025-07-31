import { Express, Response, Request, NextFunction } from 'express';
import { createPaymentController, deletePaymentController, getPaymentByIdController, getPaymentController, updatePaymentController } from './payment.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';

const payment = (app: Express) => {
    // create payment
    app.route('/payment').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createPaymentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all payments
    app.route('/payment_all').get(
        // isAuthenticated,
        // isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getPaymentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get payment by id
    app.route('/payment/:paymentId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getPaymentByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update payment by id
    app.route('/payment/:paymentId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updatePaymentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete payment by id
    app.route('/payment/:paymentId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deletePaymentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default payment