import request from 'supertest';
import server, {connectDB} from '../server'; 
import db from '../config/db';

// describe('GET /api', () => {
//     test('should send back a json response from /api', async () => {
//         const res = await request(server).get('/api') 

//         // si se cumple
//         expect(res.status).toBe(200)
//         expect(res.headers['content-type']).toMatch(/json/) //tomatch es una expresion regular que busca un json
//         expect(res.body.message).toBe('Desde API')

//         //no se cumple
//         expect(res.status).not.toBe(404)
//         expect(res.body.msg).not.toBe('desde api');
        
//     })
// })

jest.mock('../config/db')               // mock de la base de datos. base de datos simulada con la configuracion de sequelize

describe('connectDB', () => {           // describe para la funcion connectDB
    test('should handle database connection error', async () => {   // test para manejar errores de conexión a la base de datos
        jest.spyOn(db, 'authenticate')                              // espia la funcion authenticate de db
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la base de datos'))  // rechaza la promesa con un error
        const consoleSpy = jest.spyOn(console, 'log')             // segundo espia, ahora espia la funcion console.log dentro del catch(error)

        await connectDB();                                        // llama a la funcion connectDB

        expect(consoleSpy).toHaveBeenCalledWith(                // espera que console.log haya sido llamado con
            expect.stringContaining('Hubo un error al conectar a la base de datos')    // un string que contenga 'Hubo un error al conectar a la BD'
        )
    })
})