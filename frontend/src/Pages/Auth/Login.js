import React, { useState } from 'react';
import Layout from '../../Layout/Layout';
import authStyle from "../../Style/authStyle.css";
import axios from "axios";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Layout/BaseUrl';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/auth';

const Login = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const location = useLocation()

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    }


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post(`${baseUrl}/api/v1/user/login`,{... loginData});
            
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);

                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token
                })
                localStorage.setItem('auth',JSON.stringify(res.data)) //json data localstorage me supprot nhi karta that's why data ko string me convert kar rahe ahi
                // Add a delay before navigating
                setTimeout(() => {
                    navigate(location.state ||'/');
                }, 1000); 
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            // Check if the error response structure is as expected
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <Layout title={'Register'}>
            <div className='form-containor'>
                <form onSubmit={handleSubmit}>
                    <h4 className='mb-3 title'>Login page</h4>
                    <div className="form-group mb-2">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleUserInput}
                            placeholder="Enter your email"
                        />
                    </div>


                    <div className="form-group mb-2">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleUserInput}
                            placeholder="Password"
                        />
                    </div>

                    <div className='mr-5 mb-2 decoration-none'>
                        <Link to="/forgot-password">Forgot password</Link>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
