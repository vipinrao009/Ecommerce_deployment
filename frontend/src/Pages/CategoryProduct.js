import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout.js'
import axios from 'axios';
import { baseUrl } from '../Layout/BaseUrl.js';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const CategoryProduct = () => {
    const params = useParams();
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState(null);

    const getProductByCategory = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/v1/product/product-category/${params.slug}`);
            if (data?.success) {
                setProduct(data?.product);
                setCategory(data?.category);
                toast.success("Fetched the categories.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProductByCategory();
    }, [params.slug]);

    return (
      <Layout>
        <div className="mt-4">
          <h4 className='text-center'>Category - {category?.[0]?.name || 'Loading...'}</h4>
          <h4 className='text-center'>Products found - {product?.length}</h4>
          <div className="row">
            <div className="d-flex flex-wrap justify-content-center">
            {product?.map((product) => (
              <Link to={`/detailed-product/${product.slug}`} className='text-decoration-none'>
                  <div key={product._id} className="card m-2" style={{width:'16rem'}}>
                  <img 
                    src={`${baseUrl}/api/v1/product/get-photo/${product._id}`}
                    className="card-img-top small-card-img"
                    alt={product.name} 
                    style={{ width: '250px', height:'200px'}} 
                  />
                  <div className="card-body">
                    <div className='d-flex justify-content-between'>
                      <h5 className="card-title">{product.name}</h5>
                      <strong><p className="card-text">$ {product.price}</p></strong>
                    </div>
                    <p className="card-text">{product.description.substring(0,30)}</p>
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

export default CategoryProduct;
