
import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { useAuth } from '../Context/auth';
import { useCart } from '../Context/cart';
import { baseUrl } from '../Layout/BaseUrl.js';
import toast from 'react-hot-toast';
import DropIn from 'braintree-web-drop-in-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");  // Hold client token here
    const [instance, setInstance] = useState(null);  // Set DropIn instance here
    const [loading, setLoading] = useState(false);  // Loading state for button
    const navigate = useNavigate()

    // Calculate total cart amount
    const totalAmount = () => {
        try {
            let total = 0;
            cart?.forEach(item => {
                total += item?.price;
            });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Remove cart item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex(item => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
            toast.success('Product removed');
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch payment token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/v1/product/payment/token`);
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log("Error fetching client token:", error);
        }
    };

    // Handle payment request
    const handlePayment = async () => {
        if (!instance) {
            toast.error("Payment gateway is not ready yet. Please wait.");
            return;
        }

        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();  // Request nonce

            const { data } = await axios.post(`${baseUrl}/api/v1/product/payment/subscribe`, {
                nonce,
                cart,
            });
            console.log({data})
            if(data?.ok){
                setLoading(false);
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/dashboard/user/orders");
                toast.success("Payment Completed Successfully!");
            }else{
                toast.error("Payment failed")
            }
        } catch (error) {
            console.log("Payment Error:", error);
            toast.error("Payment failed. Please try again.");
            setLoading(false);
        }
    };

    // Get the client token when the component loads
    useEffect(() => {
        if (auth?.token) {
            getToken();
        }
    }, [auth?.token]);

    // Load cart items from localStorage
    useEffect(() => {
        const existingCartItems = localStorage.getItem('cart');
        if (existingCartItems) setCart(JSON.parse(existingCartItems));
    }, []);

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 mt-3">
                        <h1 className="text-center">
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className="text-center">
                            {cart.length > 1
                                ? `You have ${cart.length} product(s) in your cart. ${auth.token ? "" : "Please login to checkout."}`
                                : "Your cart is empty"}
                        </h4>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-7">
                        {cart?.map((product,index) => (
                            <div key={`${product._id}-${index}`} className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                                        <img
                                            src={`${baseUrl}/api/v1/product/get-photo/${product._id}`}
                                            className="img-fluid rounded-start"
                                            alt={product.name}
                                            style={{ width: '300px', height: '200px' }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body ms-3 d-flex flex-column justify-content-center">
                                            <h5 className="card-title mb-2">{product.name}</h5>
                                            <p className="card-text mb-2">
                                                {product.description.substring(0, 30)}...
                                            </p>
                                            <p className="card-text">
                                                <strong>$ {product.price}</strong>
                                            </p>
                                        </div>
                                        <button onClick={() => removeCartItem(product._id)} className="btn btn-danger ms-4">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-5 text-center">
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: {totalAmount()}</h4>

                        <div className="mt-2">
                            {clientToken ? (
                                <DropIn
                                    options={{
                                        authorization: clientToken,
                                        paypal: {
                                            flow: "vault",
                                        },
                                    }}
                                    onInstance={(instance) => {
                                        console.log("DropIn instance:", instance);  // Debug log
                                        setInstance(instance);
                                    }}
                                />
                            ) : (
                                <p>Loading Payment Gateway...</p>  // Show loading until clientToken is fetched
                            )}

                            <button
                                className="btn btn-primary"
                                onClick={handlePayment}
                                disabled={loading || !instance}
                            >
                                {loading ? "Processing..." : "Make Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;

