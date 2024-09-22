import { useEffect, useState } from "react";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { baseUrl } from "../../Layout/BaseUrl";
import Spinner from "../Spinner";


export default function PrivateRoutes(){
    const [ok,setOk] = useState(false)
    const [auth] = useAuth();

    useEffect(()=>{
        const authCheck = async ()=> {
            const res =  await axios.get(`${baseUrl}/api/v1/user/user-auth`);
            if(res.data.ok){
                setOk(true)
            }else{
                setOk(false)
            };
        };
        if(auth?.token) authCheck()
    },[auth?.token])

    return ok ? <Outlet/> : <Spinner/>
}