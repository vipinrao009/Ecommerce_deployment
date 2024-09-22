import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/auth'
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import Spinner from '../Spinner';
import { baseUrl } from '../../Layout/BaseUrl';

const Admin = () => {
    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth();

    useEffect(()=>{
      const authCheck = async ()=>{
       try {
         const res = await axios.get(`${baseUrl}/api/v1/user/admin-auth`) //header hmne dusri jagah se default send kar diya h
         if(res.data.ok){
           setOk(true)
         }else{
           setOk(false)
         }
       } catch (error) {
        console.error('Error during authentication check:', error);
        setOk(false); // Ensure ok is false in case of an error
       }
      }

      if(auth?.token) authCheck();
    },[auth?.token])

  return ok ? <Outlet/> : <Spinner path=''/>
}

export default Admin
