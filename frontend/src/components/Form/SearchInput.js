import React from 'react'
import { useSearch } from '../../Context/search'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Layout/BaseUrl';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate()
   

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.get(`${baseUrl}/api/v1/product/product-search/${values.keyword}`);
            console.log(data)
            if(data?.success){
                setValues({...values, result:data})
            }
            console.log('mmmmmmmmmmm',values)
            navigate("/search")
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching search input");
        }
    }

    return (
        <>
        <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={values.keyword}
                onChange={(e)=>setValues({...values, keyword: e.target.value})}
            />
            <button className="btn btn-outline-success" type="submit">
                Search
            </button>
        </form>
        </>
    )
}

export default SearchInput
