import { Express, Response, Request, NextFunction } from 'express';
import { createDoctorController, deleteDoctorController, getDoctorByIdController, getDoctorsController, updateDoctorByIdController } from './doctor.controller';

const doctor = (app: Express) => {
    //create doctor
    app.route('/doctor').post(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await createDoctorController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all doctors
    app.route('/doctor_all').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getDoctorsController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    // get doctor by id
    app.route('/doctor/:doctorId').get(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await getDoctorByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update doctor by id
    app.route('/doctor/:doctorId').put(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await updateDoctorByIdController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete doctor by id
    app.route('/doctor/:doctorId').delete(
        async (req:Request, res:Response, next:NextFunction) => {
            try {
                await deleteDoctorController(req,res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default doctor