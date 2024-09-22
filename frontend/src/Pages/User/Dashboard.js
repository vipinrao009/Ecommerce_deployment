import React from 'react'
import Layout from '../../Layout/Layout'
import UserMenu from '../../Layout/UserMenu'
import { useAuth } from '../../Context/auth'

const Dashboard = () => {
  const [auth, setauth] = useAuth();
  return (
    <Layout title={"Dashboard"}>
        <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
           <UserMenu/>
          </div>

          <div className="col-md-6">
            <div className="card p-3">
            <h2>Name : {auth?.user?.name}</h2>
            <h2>Email : {auth?.user?.email}</h2>
            </div>
          </div>
        </div>
        </div>
    </Layout>
  )
}

export default Dashboard
