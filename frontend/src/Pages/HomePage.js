import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from  '.././Layout/BaseUrl'
import {Checkbox , Radio} from 'antd'
import { price } from '../components/Price';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/cart';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategories] = useState([]);
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(1) //Initially false 
  const [cart,setCart] = useCart();
  const navigate = useNavigate()


  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data.category);
        toast.success("Fetched the categories.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching categories");
    }
  };
  
  const getAllProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${baseUrl}/api/v1/product/product-list/${page}`);
      setLoading(false)
      setProducts(data?.product)
      if (data?.success) {
        toast.success(data.message);
        setProducts(data.product);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.log('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts();
  }, [checked.length,radio.length]);

  // Get total count 
  const getTotalCount = async ()=> {
    try {
      const {data} = await axios.get(`${baseUrl}/api/v1/product/product-count`);
      if(data?.success){
        setTotal(data?.total);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching total count product");
    }
  }

  useEffect(()=>{
    getAllCategory();
    getTotalCount()
  },[])

  // Load More products
  const loadMore = async()=> {
    try {
      setLoading(true)
      const {data} = await axios.get(`${baseUrl}/api/v1/product/product-list/${page}`);
      console.log('more data',{data})
      setLoading(false)
      setProducts([...products, ...data?.product])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(page === 1) return
    loadMore()
  },[page])
  
  const handleFilter = async (value,id) => {
    let all = [...checked];
    if(value)(
      all.push(id)
    )
    else{
      all = all.filter(c => c !== id)
    }
    setChecked(all)
  }
  
  useEffect(()=>{
    if(checked.length || radio.length) filterProduct();
  },[checked,radio])

  const filterProduct = async ()=>{
    try {
      const {data} = await axios.post(`${baseUrl}/api/v1/product/product-filter`,{radio,checked})
      if(data.success){
        console.log(data)
        setProducts(data?.products)
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout title={'Best offers'}>
      <div className="row mt-3 center ms-2">
        <div className="col-md-2">
          <h4>Category</h4>
          <div className="d-flex flex-column">
            {category?.map((c)=>(
              <Checkbox key={c._id} onChange={(e)=>handleFilter(e.target.checked,c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4>Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e)=> setRadio(e.target.value)}>
              {
                price?.map((p)=>(
                  <div key={p.name} className="div">
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))
              }
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button className='btn btn-danger mt-2' onClick={()=> window.location.reload()}>Reset Filters</button>
          </div>
        </div>

        <div className="col-md-9 mx-4">
          <h1 className='text-center'>All Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products?.map((product) => (
                <div key={product._id} className="card m-2" style={{width:'18rem'}}>
                  <img 
                    src={`${baseUrl}/api/v1/product/get-photo/${product._id}`}
                    className="card-img-top small-card-img"
                    alt={product.name} 
                    style={{ width: '300px', height:'250px'}} 
                  />
                  <hr />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description.substring(0,30)}</p>
                    <p className="card-text">$ {product.price}</p>
                    <button className='btn btn-primary ms-1' onClick={()=> navigate(`/detailed-product/${product.slug}`)}>More details</button>
                    <button className='btn btn-primary ms-1' 
                        onClick={()=>{
                        setCart([...cart,product])
                        localStorage.setItem('cart',JSON.stringify([...cart,product]))
                        toast.success("Item added to cart")
                        }}
                        >Add to Cart
                    </button>
                  </div>
                </div>
            ))}

            <div className='m-2 p-3'>
              {products && products.length < total && (
                <button 
                  className='btn btn-warning' 
                  onClick={(e)=>{
                  e.preventDefault();
                  setPage(page +1)
                }}>
                  {loading ? "loading..." : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
