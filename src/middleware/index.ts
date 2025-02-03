import {Request, Response, NextFunction} from 'express';    // importa Request, Response y NextFunction de express
import { validationResult } from 'express-validator';   // importa la funcion validationResult de express-validator
export const handleInputError = (req: Request, res: Response, next:NextFunction) => {
           
    let errors = validationResult(req)  // guarda los errores de validacion
    if(!errors.isEmpty()){ 
        return res.status(400).json({errors: errors.array()}); // si hay errores, responde con un status 400 y un json con los errores
    }
    next(); // si no hay errores, llama al siguiente middleware
}   