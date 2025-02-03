import {Sequelize} from 'sequelize-typescript';
import dotenv from 'dotenv';
// funcion que lee el archivo .env y lo guarda en process.env
dotenv.config();

// crea una nueva instancia de Sequelize con la url de la base de datos
const db =  new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],          // sale de config y entra a models para leer todos los modelos
    logging: false
});
export default db;  