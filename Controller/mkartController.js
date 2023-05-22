const eKartModel = require('../Model/Schema')
const helper = require('../Utilities/helper');

/* USER METHODS */

exports.getUsers = async(req,res) => {
    try {
        const userData = await eKartModel.users.find({},{_id : 0 ,__v:0});

        if(userData) { 
            res.status(200).json({
                message : userData
            })
        } else {
            res.status(400).json({
                message : "Some error occured"
            })
        }
    } catch (error) {
        res.status(404).json({
            message : error.message
        })
    }
}

exports.signUp = async(req,res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const name = req.body.name

        console.log(username,password,name);

        const IsUser = await helper.checkUser(username);

        if(IsUser) {
            res.status(201).json({
                message : "User Already Registered"
            })
        } else {
            const response = await eKartModel.users.create({
                username : username,
                name : name,
                password : password
            }).then((result) => {
                console.log(result)
            })

            res.status(201).json({
                message : "User Registered Succesfully" 
            })

        }
    } catch (error) {
        console.log(error);
        res.status(404).json( {
            message : error.message
        })
    }
}

exports.login = async(req,res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        console.log(username,password)
        const data = await eKartModel.users.find({username:username,password:password});
        if(data.length > 0){
            res.status(200).json({
                message : "Login Successfull"
            })
        }
        else {
            res.status(200).json({
                message : "User not found"
            })
        }
    } catch (error) {
        res.status(404).json({
            message : error.message
        })   
    }
}

exports.updatePassword = async(req,res) => {
    try {
        const passwordCheckResponse = await eKartModel.users.find({username : req.params.username , password : req.body.password})

        if(passwordCheckResponse.length > 0) {
            res.status(201).json({
                message : "Current password should not be same as new password"
            })
        } else {
            console.log(req.body)
            const updatedPassword = await eKartModel.users.findOneAndUpdate(
                {username : req.params.username},
                {password : req.body.password},
                {
                    new : true,
                    runValidator : true,
                });
            console.log(updatedPassword)
            if(updatedPassword != null) {
                res.status(200).json({
                    message : "Password Changed Succesfully"
                })
            } else {
                res.status(400).json({
                    message : "Password not changed"
                })
            }
        }  
    } catch (error) {
        res.status(404).json({
            message : error.message
        })
    }
}

/* PRODUCTS METHODS */

exports.insertProducts = async(req,res) => {
    try {
        const productPicture = req.body.productPicture
        const productName = req.body.productName
        const manufacturer = req.body.manufacturer
        const cost = req.body.cost
        const description = req.body.description
        const colors = req.body.colors
        const discountPercentage = req.body.discountPercentage
        const deliveryCharge = req.body.deliveryCharge
        const avgRating = req.body.avgRating
        let rating  = 0;

        let temp = avgRating;

        for(let i = 0; i < temp.length;i++) {
            rating += temp[i].rating
        }

        rating = rating/temp.length;
        rating = rating.toFixed(1)

        const response = await eKartModel.products.create({
            productPicture: productPicture,
            productName :productName,
            manufacturer : manufacturer,
            cost : cost,
            rating :rating,
            description : description,
            colors : colors,
            discountPercentage : discountPercentage,
            deliveryCharge :deliveryCharge,
            avgRating : avgRating
        })

        if(response) {
            res.status(201).json({
                message : "Products added"
            })
        } else {
            res.status(201).json({
                message : "Some problem occured"
            })
        }

    } catch (error) {
        res.status(404).json({
            message : error.message
        })
    }
}

exports.getProducts = async(req,res) => {
    try {
        const allProducts = await eKartModel.products.find({},{_v:0});
        if(allProducts.length > 0) {
            res.status(200).json({
                message : allProducts
            })
        } else {
            res.status(200).json({
                message : "No products available"
            })
        } 
    } catch (error) {
        error.status(404).json({
            message : error.message
        })
    }
}

exports.getProductDetails = async(req,res) =>  {
    try {
        const v1 = req.params.productname
        const v2 =  req.query
        console.log(v1,v2)
        const data = await eKartModel.products.find({productName : req.params.productname})

        if(data.length > 0){
            res.status(200).json({
                message : data
            })
        } else {
            res.status(200).json({
                message : "not able to fetch data"
            })
        }

    } catch (error) {
        res.status(404).json({
            message : error.message
        })
    }
}


exports.getDeals = async(req,res) => {
    try {
        console.log("here")
        const deals = await eKartModel.products.find({
            discountPercentage : {$gt : 0}
        });

        if(deals.length > 0){
            res.status(200).json({
                message : deals
            })
        } else {
            res.status(400).json({
                message : "No deals available"
            })
        }
    } catch (error) {
        res.status(404).json({
            message : error.message
        })
    }
}

exports.addReview = async(req,res)=>{
    try {
        
        const productInfo = await eKartModel.products.find({productName : req.body.productName});

        if(productInfo) { // if product exists

            const reviewObj = {
                rating : req.body.rating,
                reviewComments : req.body.comments
            }

            productInfo[0].avgRating.push(reviewObj);
            await productInfo[0].save();
            await helper.updateRating(req.body.productName);

            res.status(200).json({
                message : "review added"
            });
        } else {
            res.json(400).json({
                message : "Product does not exists"
            })
        }

    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
}

/* Order APIs */

exports.placeOrder = async(req,res) => {
    try {

        const cart = await eKartModel.cart.find({username : req.params.username},{_id :0 ,_v : 0})
        
        if(cart.length === 0) {
            res.status(400).json({
                message : "cart is empty"
            })
        } else {
            const placeOrderResponse = await eKartModel.orders.create(req.body);
            
            if(placeOrderResponse !== null){
                const deleteCartDataResponse = await eKartModel.cart.deleteOne(
                    {username : req.params.username}
                )

                if(deleteCartDataResponse) {
                    res.status(201).json({
                        message : "Order placed successfully"
                    })
                } else {
                    res.status(201).json({
                        message : "Some error occured try again later"
                    })
                }
                
            } else {
                res.status(400).json({
                    message : "Some error occured"
                })
            }

        }

    } catch (error) {
        res.status(404).json({
            message : error.message6
        })
    }
}

/* CART APIs */

exports.viewCart = async(req,res) => {
    try {
        console.log(new Date())
        const cart = await eKartModel.cart.find({username : req.params.username},{_id :0 ,_v : 0});
        if(cart.length > 0) {

            let subtotal = 0;

            cart[0].items.forEach(cartItem => {
                subtotal+=cartItem.total;
            });

            console.log(subtotal);

            res.status(200).json({
                message : cart,
                total : subtotal
            })
        } else {
            res.status(200).json({
                message : "Cart is Empty"
            })
        }
    } catch (error) {
        res.status(404).json({
            message : error.message6
        })
    }
}

exports.modifyCart = async(req,res) => {
    try {

        const flag = req.body.flag;
        const name = req.params.username
        

        if(flag === "update") {

            const quantity = req.body.quantity;
            console.log(quantity);
            if(quantity === 0) { // if quantity is 0 then delete the item from cart

                const deletedDataResponse = await eKartModel.cart.updateOne({
                    username : name,
                },
                {
                    "$pull" : { // this will remove the particular product from the cart
                        "items" : {
                            'productName' : req.body.productName
                        }
                    }
                })

                if(deletedDataResponse!==null) {
                    res.status(201).json({
                        message : "Updated cart"
                    })
                } else {
                    res.status(201).json({
                        message : "Some Problem Occured"
                    })
                }

            } else { // if quantity is more than zero then update to database
                const cartData = await eKartModel.cart.findOne({username: req.params.username });
                let total = 0
                for (const item of cartData.items) {
                    if (item.productName === req.body.productName) {
                        total = req.body.quantity * item.cost + item.deliveryCharge                          
                        break
                    }
                }

                const updateDataResponse = await eKartModel.cart.updateOne({
                    username : name,
                    "items.productName" : req.body.productName
                },
                {
                    "$set" : {
                        "items.$.quantity" : req.body.quantity,
                        "items.$.total" : total
                    }
                })

                if(updateDataResponse !== null) {
                    res.status(201).json({
                        message : "Quantity updated"
                    })
                } else {
                    res.status(201).json({
                        message : "Some Problem Occured"
                    })
                }
            }

            
        } 

        if(flag === "delete") {
            console.log("here");

            const deletedDataResponse = await eKartModel.cart.updateOne({
                username : name,
            },
            {
                "$pull" : { // this will remove the particular product from the cart
                    "items" : {
                        'productName' : req.body.productName
                    }
                }
            })

            console.log(deletedDataResponse)

            if(deletedDataResponse!==null) {
                res.status(201).json({
                    message : "Deleted"
                })
                //helper.updateCart(name)
            } else {
                res.status(201).json({
                    message : "Some Problem Occured"
                })
            }
        }

    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            
            message : error.message
        })
    }
}

exports.addToCart = async (req, res) => {
    try {
        const user = await eKartModel.users.findOne({ username: req.params.username }, { _id: 0, __v: 0 });
        let flag = false;
        if (user) { // user is valid
            const product = await eKartModel.products.findOne({ productName: req.body.productName }, { _id: 0, __v: 0 })
            if (product) { // productname exists
                let cost = 0
                
                if(product.discountPercentage > 0) {
                    cost = product.cost - product.cost*(product.discountPercentage/100)
                } else {
                    cost  = product.cost
                }

                const productItem = {
                    productPicture : product.productPicture,
                    productName: product.productName,
                    manufacturer: product.manufacturer,
                    cost: Number(cost),
                    deliveryCharge: Number(product.deliveryCharge),
                    quantity: Number(req.body.quantity),
                    total: Number(cost) * Number(req.body.quantity) + Number(product.deliveryCharge),
                }

                const cartData = await eKartModel.cart.findOne({username: req.params.username });

                if (cartData) { 

                    let isProductAlreadyPresent = false

                    for (const item of cartData.items) {
                        if (item.productName === product.productName) {
                            isProductAlreadyPresent = true
                            item.quantity += Number(req.body.quantity)
                            item.total = item.quantity * item.cost + item.deliveryCharge                          
                            break;
                        }
                    }


                    if (isProductAlreadyPresent) {
                        flag = true;
                    }
                    else {
                        cartData.items.push(productItem)
                        await cartData.save()
                        //helper.updateCart(user.username);
                    }
                }

                else { // cart is not created yet for the user                    
                    const name = req.params.username;

                    console.log(productItem);
                    const totalPrice = (cost * productItem.quantity);
                    const totalDeliveryCharge = productItem.deliveryCharge;
                    const grandTotal = productItem.total;

                    //console.log(name,totalPrice,totalDeliveryCharge,grandTotal)

                    const test =  await eKartModel.cart.create({
                        username: name, 
                        totalPrice: totalPrice , 
                        totalDeliveryCharge: totalDeliveryCharge ,
                        grandTotal: grandTotal , 
                        items: [productItem]
                    });
                }

                if(flag) {
                    res.status(201).json({
                        message : "Item already in cart"
                    })
                } else {
                    res.status(200).json({ 
                        message: "Items Added successfully" 
                    })
                }
                
                
            }
            else { //productname doesn't exist
                res.status(200).json({ message: "Product doesn't exist" })
            }
        }
        else { // user is not valid
            res.status(200).json({ message: "User is not valid" })
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}



/* INVALID METHODS */

exports.invalid = async(req,res) => {
    res.status(404).json({
        message : 'Resource not found'
    })
}
