import axios from "axios";
import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            const parsedData = JSON.parse(data);
            // Set the state directly with parsed user and token
            setAuth({
                user: parsedData.user, 
                token: parsedData.token
            });

            // Moved the setting of Axios Authorization header inside useEffect 
            // after we successfully retrieve the token from localStorage
            axios.defaults.headers.common["Authorization"] = parsedData.token;
        }
    }, []); // Empty dependency array to run this effect only once when the component mounts

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
