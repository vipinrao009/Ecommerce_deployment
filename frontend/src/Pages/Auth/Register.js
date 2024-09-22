import React, { useState } from 'react';
import Layout from '../../Layout/Layout';
import authStyle from "../../Style/authStyle.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Layout/BaseUrl';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        question:"",
        password: ""
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    }


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post(`${baseUrl}/api/v1/user/register`,{... userInput});
            if (res.data.success) {
                toast.success(res.data.message);
                // Add a delay before navigating
                setTimeout(() => {
                    navigate('/login');
                }, 2000); 
            } else {
                toast.error(res.data.message);
                console.log("half",res.data.message);
            }
        } catch (error) {
            console.error('Full error object:', error);
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
                    <h4 className='mb-3 title'>Register page</h4>
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={userInput.name}
                            onChange={handleUserInput}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={userInput.email}
                            onChange={handleUserInput}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={userInput.phone}
                            onChange={handleUserInput}
                            placeholder="Enter your phone"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={userInput.address}
                            onChange={handleUserInput}
                            placeholder="Enter your address"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="question"
                            value={userInput.question}
                            onChange={handleUserInput}
                            placeholder="Enter your question"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={userInput.password}
                            onChange={handleUserInput}
                            placeholder="Password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
