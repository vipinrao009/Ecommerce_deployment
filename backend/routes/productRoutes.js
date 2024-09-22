import express from 'express'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidable from "express-formidable"
import { createProduct, deleteProduct, getAllProduct, getOrderDetails, getPhoto, paymentSubscribe, paymentToken, productCategory, productCount, productFilter, productList, productSearch, relatedProduct, singleProduct, updateProduct } from '../controllers/productController.js';
const router = express.Router();

router.post("/create-product",requireSignIn,isAdmin,formidable(),createProduct)
router.get("/get-product",getAllProduct)
router.get("/single-product/:slug",singleProduct)
router.get("/get-photo/:id",getPhoto)
router.delete("/delete-product/:id",requireSignIn,isAdmin,deleteProduct)
router.put("/update-product/:id",requireSignIn,isAdmin,formidable(),updateProduct)
router.post("/product-filter",productFilter)
router.get("/product-count",productCount) //All Product count 
router.get("/product-list/:page",productList) //product per page
router.get("/product-search/:keyword",productSearch) //Search product
router.get("/related-product/:pid/:cid",relatedProduct) //similar product
router.get("/product-category/:slug",productCategory)

//payment token
router.get('/payment/token',paymentToken)
// make payment
router.post('/payment/subscribe',requireSignIn,paymentSubscribe)
//Get order
router.get("/getOrderDetails",requireSignIn,getOrderDetails)
export default router 