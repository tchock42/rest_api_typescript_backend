import express from 'express'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger' 
import router from './router'
import db from './config/db'

//conectar de forma asincrona a la base de datos
export async function connectDB(){
    try {
        await db.authenticate();
        db.sync();
        // console.log(colors.bgBlue.white('Conexión exitosa a la base de datos'));
    } catch(error){ 
        // console.log(error);
        console.log(colors.bgRed('Hubo un error al conectar a la base de datos')); 
    }
}

connectDB();                         // conecta a la base de datos

const server = express()            // crea el servidor

// permitir conexiones
const corsOptions: CorsOptions = {  // este código permite las conexiones CORS
    origin: (origin, callback) => {
        if(origin === process.env.FRONTEND_URL){    // carga el origen de la peticion del cliente
            callback(null, true)                    // permite conexión
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))       // usa la configuración anterior

server.use(express.json());          // middleware para leer json
server.use(morgan('dev'))           
server.use('/api/products', router);    // usa el router en la ruta /api/products

/* ruta para pruebas
// server.get('/api', (req, res) => {  // ruta /api para las pruebas de integración
//     res.json({message: 'Desde API'})
// }) 
// */

/* ruta para documentación */
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions)); // usa swagger en la ruta /docs y muestra la documentación en la ruta /docs

export default server