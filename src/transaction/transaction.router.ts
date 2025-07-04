import { Express, Response, Request, NextFunction } from 'express';
import { createTransactionController, deleteTransactionController, getTransactionByIdController, getTransactionController, updateTransactionController } from './transaction.controller';

export const transaction = (app: Express) => {
    // create transaction
    app.route('/transaction').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createTransactionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all transactions
    app.route('/transaction_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getTransactionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get transaction by id
    app.route('/transaction/:transactionId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getTransactionByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update transaction by id
    app.route('/transaction/:transactionId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updateTransactionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete transaction by id
    app.route('/transaction/:transactionId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteTransactionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default transaction