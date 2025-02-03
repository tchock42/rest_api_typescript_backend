import {exit} from 'node:process'
import db from '../config/db'
// función para eliminar los datos de la base de datos
const clearDB = async () => {
    try {
        await db.sync({force:true})
        console.log('Datos eliminados correctamente')
        exit(0)                                         // finaliza la ejecución sin error 
    } catch (error) {
        console.log(error)
        exit(1)                                         // finaliza la ejecución con error
    }
}

if(process.argv[2] === '--clear'){
    clearDB()
}

console.log(process.argv)