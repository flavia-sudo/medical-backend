import { Express, Response, Request, NextFunction } from 'express';
import { createPrescriptionController, deletePrescriptionController, getPrescriptionByIdController, getPrescriptionByUserIdController, getPrescriptionController, updatePrescriptionController, getPrescriptionByDoctorIdController } from './prescription.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';
import { get } from 'http';

const prescription = (app: Express) => {
    app.route('/prescription').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createPrescriptionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/prescription_all').get(
        // isAuthenticated,
        // isAdmin,
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getPrescriptionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/prescription/:prescriptionId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getPrescriptionByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/prescription/:prescriptionId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updatePrescriptionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/prescription/:prescriptionId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deletePrescriptionController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/prescription/user/:userId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getPrescriptionByUserIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/prescription/doctor/:doctorId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getPrescriptionByDoctorIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default prescription