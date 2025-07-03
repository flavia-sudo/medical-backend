import { Express, Response, Request, NextFunction } from 'express';
import { createComplaintController, deleteComplaintController, getComplaintByIdController, getComplaintController, updateComplaintController } from './complaint.controller';

const complaint = (app: Express) => {
    // create complaint
    app.route('/complaint').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createComplaintController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all complaints
    app.route('/complaint_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getComplaintController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get complaint by id
    app.route('/complaint/:complaintId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getComplaintByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update complaint by id
    app.route('/complaint/:complaintId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updateComplaintController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete complaint by id
    app.route('/complaint/:complaintId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteComplaintController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default complaint