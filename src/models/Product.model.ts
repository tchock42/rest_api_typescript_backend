import { Table, Column, Model, DataType, Default} from "sequelize-typescript";

@Table({ tableName: "products"})    // decorador para definir una tabla

class Product extends Model{ // define las columnas, sus nombres (schemas) y sus tipos de datos | extiende de Model
    @Column ({                          // decorador para definir una columna
        type: DataType.STRING(100)      // tipo de dato de la columna
    })
    declare name: String                        //nombre de la columna

    @Column({
        type:DataType.FLOAT()
    })
    declare price: number

    @Default(true)                      // valor true por defecto
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean
}

export default Product;