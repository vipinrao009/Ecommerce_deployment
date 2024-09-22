import React from 'react'
import Layout from '../Layout/Layout'
import useCategory from '../hook/useCategory'
import { Link } from 'react-router-dom'

const Categories = () => {
    const categories = useCategory()
  return (
    <Layout>
      <div className='container'>
        <div className='row'>
            {categories?.map((c)=>(
                <div className="col-md-6 mt-5 mb-3">
                    <Link to={'/'} className='btn btn-primary'>
                      {c.name}
                    </Link>
                </div>
            ))}
        </div>
      </div>
    </Layout>
  )
}

export default Categories
