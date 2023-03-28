const express = require('express')
const eKartRouter = express.Router()
const eKartController = require('../Controller/mkartController')
const cors = require('cors');
const app = express();
app.use(cors());



/* ROUTES HERE */

/* GET REQUESTS */
eKartRouter.get('/products',eKartController.getProducts)
eKartRouter.get('/users',eKartController.getUsers)
eKartRouter.get('/:productname/details',eKartController.getProductDetails)
eKartRouter.get('/deals',eKartController.getDeals)
eKartRouter.get('/:username/cart',eKartController.viewCart)

/* POST REQUESTS */
eKartRouter.post("/insertProducts",eKartController.insertProducts)
eKartRouter.post('/signup',eKartController.signUp)
eKartRouter.post('/login',eKartController.login)
eKartRouter.post('/:username/update',eKartController.updatePassword)
eKartRouter.post('/:username/addtocart',eKartController.addToCart)
eKartRouter.post('/:username/modifycart',eKartController.modifyCart)
eKartRouter.post('/:username/orders',eKartController.placeOrder)

/* PUT REQUESTS */



/* DELETE REQUESTS */

/* INVALID ROUTES */
eKartRouter.all('*',eKartController.invalid);

module.exports = eKartRouter