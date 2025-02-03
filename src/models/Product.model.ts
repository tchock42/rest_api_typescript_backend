import { Table, Column, Model, DataType, Default} from "sequelize-typescript";

@Table({ tableName: "products"})

class Product extends Model{ // define las columnas, sus nombres (schemas) y sus tipos de datos
    @Column ({                          //decorador de columna
        type: DataType.STRING(100)      // tipo de datos
    })
    declare name: String                        //nombre de la columna

    @Column({
        type:DataType.FLOAT()
    })
    declare price: number

    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean
}

export default Product;