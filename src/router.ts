import { Router } from "express";
import {body, param} from "express-validator";
import {createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct} from "./handlers/product";
import { handleInputError } from "./middleware";
import { NotEmpty } from "sequelize-typescript";

const router = Router();

/*********************************
 * @swagger 
 * components: 
 *  schemas:    
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The Product ID
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: The Product name
 *                  example: Monitor Curvo de 49 pulgadas
 *              price: 
 *                  type: number
 *                  description: The Product price
 *                  example: 300
 *              availability:
 *                  type: boolean
 *                  description: The product availability
 *                  example: true 
*/

/**
* @swagger
* /api/products:
*   get:
*       summary: Get a list of products
*       tags: 
*           - Products
*       description: Return a list of products
*       responses:
*           200: 
*               description: Successful response
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Product'
*/
// Routing
router.get('/', getProducts)        // si la ruta es /, ejecuta el handler de consulta de productos | relativo a /api/products


/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags: 
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succssfull Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad request - Invalid ID
 */
router.get('/:id',                  // si la ruta es /:id, ejecuta el handler de consulta de producto por id | relativo a /api/products
    param('id').isInt().withMessage('ID no válido'),    // valida que el id sea un entero | param es un parametro que se puede acceder desde req.params.id
    handleInputError,                                   // middleware de errores de validación
    getProductById
)  // :id es un parametro que se puede acceder desde req.params.id

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags: 
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - invalid input data
 */

router.post('/',
    //Validacion de datos
    body('name')
        .notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price')    // se puede encadenar validaciones
        .isNumeric().withMessage('Valor no válido')                 // valida que el precio sea numerico
        .notEmpty().withMessage('El precio del producto no puede estar vacío') // valida que el precio no este vacio
        .custom(value => value > 0).withMessage('Precio no válido'),  // valida que el precio sea mayor a 0
    handleInputError, // middleware de errores de validación
    createProduct   // si pasa la validación, ejecuta el handler de creación de producto
)


/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 */
router.put('/:id',                                      // actualiza un producto por su id 
    param('id').isInt().withMessage('ID no válido'),
    //Validacion de datos
    body('name')
        .notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price')                                                       // se puede encadenar validaciones
        .isNumeric().withMessage('Valor no válido')                     // valida que el precio sea numerico
        .notEmpty().withMessage('El precio del producto no puede estar vacío')     // valida que el precio no este vacio
        .custom(value => value> 0).withMessage('Precio no válido'),     // valida que el precio sea mayor a 0
    body('availability').
        isBoolean().withMessage('Valor para disponibilidad no válido'),
        handleInputError,                                               // middleware de errores de validación
    handleInputError,
    updateProduct
)           // actualizar el producto mediante el id

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */

router.patch('/:id',                                // actualiza la disponibilidad del producto
    param('id').isInt().withMessage('ID no válido'),// valida que el id sea un entero
    handleInputError,                               // middleware de errores de validación
    updateAvailability                              // actualiza la disponibilidad del producto
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product by a give ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */

router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputError,
    deleteProduct
)                   // elimina un producto por su id

export default router;