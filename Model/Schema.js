const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connection to DB Successfull');
}).catch((error)=>{
    console.log(error);
});

let model = {}

const users = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    name : {
        type:String,
        required:true,
    },
    password : {
        type : String,
        required : true
    }
},
{
    timestamps: {
        createdAt: true,
        updatedAt: true,
      },
})

model.users = mongoose.model('users',users)

const products = new mongoose.Schema({

    productPicture:{
        type:String,
    },
    productName:{
        type:String,
    },
    manufacturer:{
        type:String,
    },
    cost:{
        type:Number,
    },
    rating:{
        type:Number,
    },
    description:{
        type:String,
    },
    colors:{
        type:[String],
    },
    discountPercentage:{
        type:Number,
    },

    deliveryCharge:{
        type:Number,
    },
    category : {
        type : String,
    },
    avgRating: [
        {      
            rating:{type: Number},
            reviewComments:{type:String}
        },
    ]
},
{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
}

)

model.products = mongoose.model("products",products)

const cart = new mongoose.Schema({
    username : {
        type : String
    },
    totalPrice : {
        type : Number
    },
    totalDeliveryCharge : {
        type : Number
    },
    grandTotal : {
        type : Number
    },
    items : {
        type : Array,
        productPicture :{
            type : String
        },
        productName : {
            type : String
        },
        manufacturer : {
            type : String
        },
        cost : {
            type : Number
        },
        deliveryCharge : {
            type : Number
        },
        quantity : {
            type : Number,
        },
        total : {
            type : Number
        }
    }
},
{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
})

model.cart  = mongoose.model("cart",cart);

const orders = new mongoose.Schema({
    username : {
        type : String
    },
    dateOfOrder : {
        type : String
    },
    totalPrice : {
        type : Number
    },
    totalDeliveryCharge : {
        type : Number
    },
    grandTotal : {
        type : Number
    },
    items : {
        type : Array,
        productName : {
            type : String
        },
        manufacturer : {
            type : String
        },
        cost : {
            type : Number
        },
        deliveryCharge : {
            type : Number
        },
        quantity : {
            type : Number,
        },
        total : {
            type : Number
        }
    }
},
{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
})


model.orders = mongoose.model("orders",orders)

module.exports = model