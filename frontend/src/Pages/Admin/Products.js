import React, { useEffect, useState } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import toast from 'react-hot-toast';
import { baseUrl } from '../../Layout/BaseUrl';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Products.css'; // Import the CSS file for additional styling

const Products = () => {
    const [products, setProducts] = useState([]);

    // Get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/v1/product/get-product`);
            if (data.success) {
                setProducts(data.product);
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <Layout>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <h1 className='text-center my-4'>All Products</h1>
                    <div className="d-flex flex-wrap justify-content-center">
                        {products?.map((p) => (
                            <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className="product-link">
                                <div className="card m-2 small-card">
                                    <img src={`${baseUrl}/api/v1/product/get-photo/${p._id}`} className="card-img-top small-card-img" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title small-card-title">{p.name}</h5>
                                        {/* <p className="card-text small-card-text">{p.description}</p> */}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;
