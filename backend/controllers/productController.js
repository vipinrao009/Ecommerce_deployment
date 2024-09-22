import slugify from "slugify";
import Product from "../models/ProductSchema.js";
import fs from 'fs'
import e from "express";
import Category from "../models/CategorySchema.js";
import braintree from "braintree";
import Order from "../models/OrderSchema.js";
import dotenv from 'dotenv'

dotenv.config()

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
  });

const createProduct = async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        switch(true){
            case !name:{
                return res.status(500).json({Error:"Name is required"})
            }
            case !description:{
                return res.status(500).json({Error:"description is required"})
            }
            case !price:{
                return res.status(500).json({Error:"price is required"})
            }
            case !category:{
                return res.status(500).json({Error:"category is required"})
            }
            case !quantity:{
                return res.status(500).json({Error:"quantity is required"})
            }
            case photo && photo.size > 1000000:{
                return res.status(400).json({message:"Photo is required and should less than 1 MB"})
            }
        }

        const products = new Product({...req.fields, slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        return res.status(200).json({
            message:"Product created successfully",
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Error in creating message",
            success: false,
            error
        })
    }
}

const getAllProduct = async(req,res) =>{
    try {
        const product = await Product.
        find({})
        .select('-photo')
        .populate("category")
        .limit(12)
        .sort({createdAt:-1}

        )
        if(product){
            return res.status(200).json({
                countTotal: product.length,
                message: "All Product",
                success: true,
                product
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message:"Failed to create product",
            success : false,
        })

    }
}

const singleProduct = async(req,res) =>{
    try {
        const {slug} = req.params

        const product = await Product.findOne({slug}).select('-photo').populate("category")
        if(!product){
            res.status(500).json({
                message: "Product not found",
                success: false
            })
        }

        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            message:"Failedmmm to fetch product",
            success:false,
        })
    }
}

const getPhoto = async(req,res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id).select("photo")

        if(product.photo.data){
            res.set("Content-type",product.photo.contentType),
            res.status(200).send(product.photo.data)
        }
    } catch (error) {
        res.status(500).json({
            message:"Failed to fetch the photo",
            success:false
        })
    }
}

const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;

        await Product.findByIdAndDelete(id).select("-photo")
        res.status(200).json({
            message:"Product deleted successfully",
            success:true
        })
    } catch (error) {
        res.status(400).json({
            message:"Failed to delete the product",
            success:false
        })
    }
}

const updateProduct = async(req,res) =>{
    try {
        const {id} = req.params;
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        switch(true){
            case !name:{
                return res.status(500).json({Error:"Name is required"})
            }
            case !description:{
                return res.status(500).json({Error:"description is required"})
            }
            case !price:{
                return res.status(500).json({Error:"price is required"})
            }
            case !category:{
                return res.status(500).json({Error:"category is required"})
            }
            case !quantity:{
                return res.status(500).json({Error:"quantity is required"})
            }
            case photo && photo.size > 1000000:{
                return res.status(400).json({message:"Photo is required and should less than 1 MB"})
            }
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const product = await Product.findByIdAndUpdate(id,{...req.fields, slug:slugify(name)},{new:true});

        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save();

        res.status(200).json({
            message:"Product updated successfully",
            success:true,
            product
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Failed to update product",
            success: false,
            error: error.message,
        })
        
    }
}

const productFilter = async(req,res) =>{
    try {
        const {checked,radio} = req.body;

        console.log({checked,radio})
        let args = {};
        if(checked.length>0) args.category = checked;
        args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args);
        res.status(200).json({
            message:"Filter Successfully",
            success:true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message:"Failed to filter the product",
            success:"false"
        })
    }
}

const productCount = async(req,res)=> {
    try {
        const total = await Product.find({}).estimatedDocumentCount();
        res.status(200).json({
            message:"sliding Succesfully",
            success:true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message:"Failed to slide",
            success:false
        })
    }
}

// Product list based on page
const productList = async(req,res)=> {
    try {
        const perPage = 3;
        const page = req.params.page ? req.params.page : 1;
        const product = await Product
          .find({})
          .select('-photo')
          .skip((page -1) * perPage)
          .limit(perPage)
          .sort({createdAt:-1})
        res.status(200).json({
            message:'Fetched the product successfully',
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message:"Failed to get product list",
            success:false
        })
    }
}

const productSearch = async(req,res)=>{
    try {
        const keyword = req.params.keyword;
        console.log(keyword)
        
        const result = await Product.find({
            $or :[
                {name:{$regex :keyword, $options:"i"}},
                {description: {$regex :keyword, $options:"i"}}
            ]
        })
        .select('-photo')
        res.status(200).json({
            message:"Search successfullly",
            success:true,
            result
        })
    } catch (error) {
        res.status(400).json({
            message: "Error in the search product",
            success:false
        })
    }
}

const relatedProduct = async(req,res)=>{
    try {
        const {pid,cid} = req.params;
        const product = await Product.find({
            category:cid,
            _id:{$ne:pid}
        })
        .select('-photo')
        .limit(4)
        .populate("category")

        res.status(200).json({
            message:"Similar products are fetched",
            success:true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message:"Failed to get related product",
            success:false
        })
    }
}

const productCategory = async(req,res)=>{
    try {
        const slug = req.params.slug
        const category = await Category.find({slug})
        const product = await Product.find({category}).populate('category')
        res.status(200).json({
            message:"Product are fetched categorywise",
            success:true,
            category,
            product
        })
    } catch (error) {
        res.status(400).json({
            message:"Failed to get categorywise product",
            success:false,
            error
        })
    }
}

// Payment token

const paymentToken = async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// subscribe payment
const paymentSubscribe = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
          total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
          {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
              submitForSettlement: true,
            },
          },
          async function (error, result) {
            console.log({ result });
            if (result) {
              try {
                const order = await new Order({
                    products: cart,
                    payment: {
                        id: result.transaction.id,  // Assuming you want to store the transaction ID
                        status: result.transaction.status,
                        amount: result.transaction.amount,
                        currency: result.transaction.currencyIsoCode,
                        // Include other fields as necessary
                    },
                    buyer: req.user._id,
                }).save();
                
          
                console.log({ order }); // Log the saved order to verify
                res.json({ ok: true, order }); // Optionally return the order in response
              } catch (err) {
                console.error("Error saving order:", err);
                res.status(500).json({ error: "Failed to save order" });
              }
            } else {
              res.status(500).send(error);
            }
          }
          
        );
      } catch (error) {
        console.log(error);
      }
    };

const getOrderDetails = async (req, res) => {
try {
    const buyer = req.user._id; // Assuming this is the buyer's ID

    // Use find() to search for all orders where the buyer matches
    const orders = await Order.find({ buyer }).populate('products', "-photo").populate('buyer', "name");

    res.status(200).json({
    message: "Order details fetched successfully",
    success: true,
    orders, // Returning all matching orders
    });
} catch (error) {
    console.error(error);
    res.status(400).json({
    message: "Failed to fetch the order details",
    success: false,
    });
}
}
  

export {
    createProduct,
    getAllProduct,
    singleProduct,
    getPhoto,
    deleteProduct,
    updateProduct,
    productFilter,
    productCount,
    productList,
    productSearch,
    relatedProduct,
    productCategory,
    paymentToken,
    paymentSubscribe,
    getOrderDetails
}