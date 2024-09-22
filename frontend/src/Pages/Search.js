import Layout  from '../Layout/Layout'
import React from 'react'
import { useSearch } from '../Context/search'
import { baseUrl } from '../Layout/BaseUrl';

const Search = () => {
    const [values, setValues] = useSearch();
    return (
        <Layout title='Search result'>
        <div className=''>
            <div className='text-center'>
                <h1>Search Results</h1>
                <h6>{values?.result.length < 1 ? 'No Products found' : `Found ${values?.result?.result?.length}`}</h6>
            </div>
            <div className="d-flex flex-wrap justify-content-center">
                {values?.result?.result?.map((product) => (
                    <div key={product._id} className="card m-2" style={{width:'18rem'}}>
                    <img 
                        src={`${baseUrl}/api/v1/product/get-photo/${product._id}`}
                        className="card-img-top small-card-img"
                        alt={product.name} 
                    />
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description.substring(0,30)}</p>
                        <p className="card-text">$ {product.price}</p>
                        <button className='btn btn-primary ms-1'>More details</button>
                        <button className='btn btn-primary ms-1'>Add to Cart</button>
                    </div>
                    </div>
                ))}
            </div>
        </div>
        </Layout>
    )
}
export default Search

