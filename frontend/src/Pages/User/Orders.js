import React, { useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import UserMenu from '../../Layout/UserMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import { baseUrl } from '../../Layout/BaseUrl'
import moment from 'moment'

const Orders = () => {
  const [order, setOrder] = useState([])

  // Get the order details
  const orderDetails = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/product/getOrderDetails`)
      console.log({data})
      setOrder(data?.orders)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
    }
  }

  useEffect(() => {
    orderDetails();
  }, []) // Empty dependency array to run only once

  return (
    <Layout title="Orders">
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="card p-3">
              <h3>All orders</h3>
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
                            <td>{p?.status}</td>
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
                                             {product.description.substring(0, 30)}...
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
        </div>
      </div>
    </Layout>
  )
}

export default Orders
