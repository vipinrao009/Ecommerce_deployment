import React, { useEffect, useState } from 'react';
import AdminMenu from '../../Layout/AdminMenu';
import Layout from '../../Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../Layout/BaseUrl';
import { Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate, useParams } from 'react-router-dom';
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [createdData, setCreatedData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",  
    shipping: "",
    photo: ""
  });

//    get single product
  const getSingleProduct = async()=>{
    try {
        const { data } = await axios.get(`${baseUrl}/api/v1/product/single-product/${params.slug}`);
        console.log(data)
        setCreatedData({
            ...createdData, 
            name:data.product.name,
            id:data.product._id,
            description :data.product.description,
            price : data.product.price,
            quantity :data.product.quantity,
            shipping :data.product.shipping,
            category :data.product.category._id,
        })
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
    }
  }

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/category/get-category`);
      
      if (data.success) {
        setCategories(data.category);
        toast.success("Fetched the categories.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching categories");
    }
  };

  // Create product function
  const handleUpdate = async () => {
    try {
      const productData = new FormData();
      productData.append('name', createdData.name);
      productData.append('description', createdData.description);
      productData.append('price', createdData.price);
      productData.append('quantity', createdData.quantity);
      productData.append('shipping', createdData.shipping);
      createdData.photo && productData.append('photo', createdData.photo);
      productData.append('category', createdData.category);

      const { data } = await axios.put(`${baseUrl}/api/v1/product/update-product/${createdData.id}`, productData);
      if (data.success) {        
        toast.success('Product updated successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error creating product");
    }
  };

  const handleDelete = async() => {
    try {
      let answer = window.prompt('Are you sure want to delete this product ??')
      if(!answer) return
      const {data} = await axios.delete(`${baseUrl}/api/v1/product/delete-product/${createdData.id}`)
      if(data.success){
        toast.success(data.message)
        navigate('/dashboard/admin/products');
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    getAllCategory();
    getSingleProduct()
  }, []);

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h2>Update Product</h2>
            <div className="m-1 w-75">

              {/* Category selection */}
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCreatedData({ ...createdData, category: value });  // Update only category
                }}
                value={createdData.category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Upload photo */}
              <div className="md-3">
                <label className="btn btn-primary col-md-12 mt-1">
                  {createdData.photo ? createdData.photo.name : "Upload image"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    hidden
                    onChange={(e) => setCreatedData({ ...createdData, photo: e.target.files[0] })}
                  />
                </label>
              </div>

              {/* Photo preview */}
              <div className="mt-3">
                {createdData.photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(createdData.photo)}
                      height="200px"
                      className="img img-responsive"
                      alt="product_photo"
                    />
                  </div>
                ):(
                  <div className="text-center">
                  <img
                    src={`${baseUrl}/api/v1/product/get-photo/${createdData.id}`}
                    height="200px"
                    className="img img-responsive"
                    alt="product_photo"
                  />
                </div>
                )}
              </div>

              {/* Input fields */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter the name"
                  value={createdData.name}
                  className="form-control"
                  onChange={(e) =>
                    setCreatedData({ ...createdData, name: e.target.value })
                  }
                />
              </div>

              <div className="mt-3">
                <TextArea
                  type="text"
                  placeholder="Enter the description"
                  value={createdData.description}
                  className="form-control"
                  onChange={(e) =>
                    setCreatedData({ ...createdData, description: e.target.value })
                  }
                />
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter the price"
                  value={createdData.price}
                  className="form-control"
                  onChange={(e) =>
                    setCreatedData({ ...createdData, price: e.target.value })
                  }
                />
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter the quantity"
                  value={createdData.quantity}
                  className="form-control"
                  onChange={(e) =>
                    setCreatedData({ ...createdData, quantity: e.target.value })
                  }
                />
              </div>

              {/* Shipping selection */}
              <div className="mt-3">
                <Select
                  bordered={false}
                  placeholder="Select shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setCreatedData({ ...createdData, shipping: value });  // Correctly updating shipping
                  }}
                  value={createdData.shipping ? "Yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              {/* Create product button */}
              <div className='col'>
  <div className="mt-3">
    <button className="btn btn-primary w-100" onClick={handleUpdate}>Update Product</button>
  </div>
  <div className="mt-3">
    <button className="btn btn-danger w-100" onClick={handleDelete}>Delete Product</button>
  </div>
</div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
