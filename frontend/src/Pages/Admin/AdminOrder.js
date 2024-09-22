import axios from 'axios'
import AdminMenu from '../../Layout/AdminMenu'
import Layout from '../../Layout/Layout'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { baseUrl } from '../../Layout/BaseUrl'
import moment from 'moment'
import { Select } from 'antd'

const AdminOrder = () => {
    const [status,setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Canceled"])
    const [order, setOrder] = useState();
    const {Option} = Select
    

    const getOrder = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/v1/user/all-orders`);
            console.log({ data });
            if (data?.success) { 
                setOrder(data?.orders);
                toast.success('Order fetched successfully');
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Error fetching orders');
        }
    };

    const handleChangeStatus = async(orderID,value)=>{
      console.log(" id ",orderID)
        try {
            const {data} = await axios.put(`${baseUrl}/api/v1/user/update-status/${orderID}`,{status:value})
            toast.success(`Order ${value} successfully`)
            getOrder()
        } catch (error) {
          toast.error(error.response?.data?.message || 'Error fetching orders');
        }
    }
    

    useEffect(()=>{
        getOrder();
    },[])
    
  return (
    <Layout>
      <div className="row container-fluid mt-4">
        <div className="col-md-3">
            <AdminMenu/>
        </div>
        <div className="col-md-9">
            <h1>All orders</h1>
            {order?.map((p,i)=>
                {
                  return(
                    <div className="border shadow">
                      <table className='table'>
                        <thead>
                          <tr>
                            <th scope='col'>{i+1}</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Buyer</th>
                            <th scope='col'>Orders</th>
                            <th scope='col'>Payment</th>
                            <th scope='col'>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{}</td>
                            <td>
                                <Select bordered={false} onChange={(value)=>handleChangeStatus(p?._id,value)} defaultValue={p?.status}>
                                    {status.map((s,i)=>(
                                        <Option key={i} value={s}>
                                            {s}
                                        </Option>
                                    ))}
                                </Select>
                            </td>
                            <td>{p?.buyer?.name}</td>
                            <td>{moment(p?.createAt).fromNow()}</td>
                            <td>{p?.payment?.amount ? "Success" : "Failed"}</td>
                            <td>{p?.products?.length}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="container-fluid">
                      {p?.products?.map((product,index) => (
                             <div key={`${product._id}-${index}`} className="card mb-3">
                             <div className="row g-0">
                                 <div className="col-md-4 d-flex align-items-center justify-content-center">
                                     <img
                                         src={`${baseUrl}/api/v1/product/get-photo/${product._id}`}
                                         className="img-fluid rounded-start"
                                         alt={product.name}
                                         style={{ width: '290px', height: '180px' }}
                                     />
                                 </div>
                                 <div className="col-md-8">
                                     <div className="card-body ms-3 d-flex flex-column justify-content-center">
                                         <h5 className="card-title mb-2">{product.name}</h5>
                                         <p className="card-text mb-2">
                                             {product.description.substring(0, 30)}
                                         </p>
                                         <p className="card-text">
                                             <strong>$ {product.price}</strong>
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                        ))}
                      </div>

                    </div>
                  )
                })}
        </div>
      </div>
    </Layout>
  )
}

export default AdminOrder
