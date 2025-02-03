import { Request, Response } from 'express';    // importa Request y Response de express
import Product from '../models/Product.model';  // importa el modelo de producto


//handler para consulta de productos
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'ASC']
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });   // busca todos los productos en la base de datos
        res.json({data: products});                 // responde con un json que contiene un objeto con la clave data y el valor de products
    } catch (error) {
        console.log(error); 
    }
}

//hndler para consulta de producto
export const getProductById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;                        // extrae el id del objeto params
        const product = await Product.findByPk(id)      // busca un producto por su id

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        res.json({data: product})   // responde con un json que contiene un objeto con la clave data y el valor de product
        
    } catch (error) {
        console.log(error)
    }
}
//handler de formulario para crear producto
export const createProduct = async (req: Request, res: Response) => {
    /* forma larga */
    // const product = new Product(req.body)           // crea un nuevo producto usando los pares clave-valor del body
    // const savedProduct = await product.save();                         // guarda el producto en la base de datos
    // res.json({
    //     data: savedProduct});                   // responde con el producto creado

    /* forma corta */
    try {
        const product = await Product.create(req.body); // crea la instancia de producto y guarda en la base de datos
        res.status(201).json({                                      // responde con el producto creado y status 201 (creado)
            data: product
        })
    } catch (error) {       
        console.log(error)
    }
}
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;                        // extrae el id del objeto params
        const product = await Product.findByPk(id)      // busca un producto por su id

        // verificar que el producto exista
        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        //actualizar el producto
        // console.log(req.body);           // imprime el body enviado
        await product.update(req.body);     // actualiza la instancia de producto con los datos del body
        await product.save();               // guarda el producto en la base de datos

        res.json({data: product})   // responde con un json que contiene un objeto con la clave data y el valor de product
        
    } catch (error) {
        console.log(error)
    }
}
export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;                        // extrae el id del objeto params
        const product = await Product.findByPk(id)      // busca un producto por su id

        // verificar que el producto exista
        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        product.availability = !product.dataValues.availability;   // actualiza la disponibilidad del producto
        await product.save();                           // guarda el producto en la base de datos
        res.json({data: product})   // responde con un json que contiene un objeto con la clave data y el valor de product
        
    } catch (error) {
        console.log(error)
    }
}
export const deleteProduct = async (req: Request, res: Response) =>{
    const {id} = req.params;                        // extrae el id del objeto params
    const product = await Product.findByPk(id)      // busca un producto por su id

    // verificar que el producto exista
    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    await product.destroy();    // elimina el producto de la base de datos
    res.json({data: 'Producto eliminado'})
}