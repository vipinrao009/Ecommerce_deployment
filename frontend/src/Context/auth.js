import axios from "axios"
import {useState, createContext, useContext, useEffect} from "react"

const AuthContext = createContext()

const AuthProvider = ({children})=>{
    const [auth,setAuth] = useState({
        user:null,
        token:""
    })

    //default axios => axios req ke sath by default header jayega hmko mannually nahi send karana padega
        axios.defaults.headers.common["Authorization"] = auth.token

    useEffect(()=>{
        const data = localStorage.getItem('auth')
        if(data){
            const parseData = JSON.parse(data)

            setAuth({
                ...auth,
                user:parseData.user,
                token:parseData.token
            })
        }
    },[])

    return(
        <>
          <AuthContext.Provider value={[auth,setAuth]}>
            {children}
          </AuthContext.Provider>
        </>
    )
}

//Custom hook 
const useAuth = () => useContext(AuthContext); //This defines useAuth as a custom hook that can be used within any functional component to access the AuthContext.


export {useAuth,AuthProvider}