import { Express, Response, Request, NextFunction } from 'express';
import { createAppointmentController,
    deleteAppointmentController,
    getAppointmentByIdController,
    getAppointmentController,
    updateAppointmentController,
    getAppointmentsByPatientIdController
} from './appointment.controller';

const appointment = (app: Express) => {
    app.route('/appointment').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createAppointmentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/appointment_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getAppointmentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/appointment/:appointmentId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getAppointmentByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/appointment/:appointmentId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updateAppointmentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/appointment/:appointmentId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteAppointmentController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/appointment/:userId').get(
        async(req:Request, res:Response, next:NextFunction) => {
            try {
                await getAppointmentsByPatientIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default appointment