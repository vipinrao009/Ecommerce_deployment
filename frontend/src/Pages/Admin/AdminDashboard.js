import React from 'react'
import Layout from '../../Layout/Layout'
import AdminMenu from '../../Layout/AdminMenu'
import { useAuth } from '../../Context/auth'

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu/>
          </div>
          <div className="col-md-6">
            <div className='card p-3 '>
              <h3>Admin name : {auth?.user?.name}</h3>
              <h3>Admin email : {auth?.user?.email}</h3>
              <h3>Admin contact : {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
