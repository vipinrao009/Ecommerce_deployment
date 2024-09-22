import Layout from '../../Layout/Layout'
import AdminMenu from '../../Layout/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../Layout/BaseUrl';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd'

const CreateCategory = () => {
    const [category, setCategory] = useState([]);
    const [name,setName] = useState("");
    const [visible,setVisible] = useState(false);
    const [selected,setSelected] = useState(null);
    const [updatedName,setUpdatedName] = useState("")

    const getAllCategory = async()=>{
        try {
            const {data} = await axios.get(`${baseUrl}/api/v1/category/get-category`)

            if(data.success){
                setCategory(data.category)
                toast.success("Fetched the category.....")
            }
            console.log({category})
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong......")
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post(`${baseUrl}/api/v1/category/create-category`,{name})
            console.log(data)
            if(data?.success){
                toast.success(`${data.category.name} is created`)
                data.name = "";
                getAllCategory()
            }
        } catch (error) {
            // console.log(error.response.data.message)
            toast.error(error.response.data.message);
        }
    }

    const handleUpdate = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.put(`${baseUrl}/api/v1/category/update-category/${selected._id}`,{name:updatedName})
            console.log(data)
            if(data.success){  
                toast.success(data.message);
                setSelected(null);
                setUpdatedName(null);
                setVisible(false);
                getAllCategory();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    
    const handleDelete = async(id) =>{
        try {
            const {data} = await axios.delete(`${baseUrl}/api/v1/category/delete-category/${id}`)
            console.log(data)
            if(data){
                toast.success(data.message);
                getAllCategory();
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)            
        }
    }

    useEffect(()=>{ 
        getAllCategory()
    },[])

    return (
        <Layout title={"Dashboard-create category"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu/>
                    </div>

                    <div className="col-md-9">
                        <h2>Manage Category</h2>
                        <div className='p-3'>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
                        </div>
                        <div>
                        <table className="table w-75">
                            <thead>
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map((c)=>(
                                    <>
                                    <tr key={c._id}>
                                        <td>{c.name}</td>
                                        <td>
                                            <button 
                                               className='btn btn-primary ms-2'
                                               onClick={() => {setVisible(true);setUpdatedName(c.name); setSelected(c)}}
                                               >Edit</button>
                                            <button className='btn btn-danger ms-2'
                                               onClick={()=>{handleDelete(c._id)}}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        <Modal onCancel={()=>
                          setVisible(false)}
                          footer={null}
                          visible ={visible}
                        >
                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory
