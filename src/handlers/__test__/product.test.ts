import request from "supertest";
import server from "../../server";

//POST
describe('POST /api/products', () => {
    test('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})   // envia un objeto vacio
        expect(response.status).toBe(400)                                       // espera un status 400
        expect(response.body).toHaveProperty('errors')                           // espera que el body tenga la clave error
        expect(response.body.errors).toHaveLength(4)                          // espera que el body.errors tenga longitud 4

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })    
    
    test('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name:"Mouse - Testing",
            price: 50
        })

        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })

    test('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name:"Monitor curvo",
            price: "hola"
        })

        expect(response.status).toEqual(400);           // espera un status 400
        expect(response.body).toHaveProperty('errors')  // espera que el body tenga la clave error
        expect(response.body.errors).toHaveLength(2)    // espera que el body.errors tenga longitud 1

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })
});

//GET
describe('GET /api/prooducts', () => {
    test('should check if /api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)   // espera que el status no sea 404
        
    })

    test('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')     // envia una peticion get a /api/products
        expect(response.status).toBe(200)                            // espera un status 200    
        expect(response.headers['content-type']).toMatch(/json/)    // espera que el content-type sea json
        expect(response.body).toHaveProperty('data')          // espera que el body tenga la clave data 
        expect(response.body.data).toHaveLength(1)           // espera que el body.data tenga longitud 1

        expect(response.body).not.toHaveProperty('errors')      // espera que el body no tenga la clave errors
    })
})

//GET
describe('GET /api/products/:id', () => {
    test('should return a 404 response for a non-existing product', async () => {
        const productId = 200;
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado');
    })

    test('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    test('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)               // espera un status 200
        expect(response.body).toHaveProperty('data')    // espera que el body tenga la clave data
        
    })
})

//PUT
describe('PUT /api/products/:id', () => {
    //mandar una url no válida pero con un objeto válido
    test('should check a invalid url with a valid object', async () => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor curvo de 32\"",
            availability: true,
            price: 500
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })
    //mandar un objeto vacío
    test('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    // verificar error ante un precio no válido
    test('should validate that the price is greater than 0', async () => { 
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor curvo de 32\"",
            availability: true,
            price: -100
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    // verificar error ante un producto no existente
    test('should return a 404 response for a non-existing product', async () => { 
        const response = await request(server).put('/api/products/2').send({
            name: "Monitor curvo de 32\"",
            availability: true,
            price: 100
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    test('should update a product correctly', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor curvo de 32\"",
            availability: true,
            price: 200
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

//PATCH
describe('PATCH /api/products/:id', () => {
    // verificar error ante un producto no existente
    test('should return a 404 response for a non-existing product', async () => {
        const productId = 2000;
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado');
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    // actualizar la disponibilidad de un producto
    test('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)  // inicia como true y se cambia a false

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')

    })

})

//delete
describe('DELETE /api/products/:id', () => {
    // mandar una url no valida
    test('should cjeck a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })
    // verificar error ante un producto no existente
    test('shoud return a 404 response for a non-existing product', async () => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`);
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200)
    })
    // verificar que se elimine un producto
    test('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1');
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto eliminado')
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(404)
    })
})