import React, { useState } from 'react'
import Layout from '../../Layout/Layout'
import axios from 'axios'
import { baseUrl } from '../../Layout/BaseUrl'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {

    const navigate = useNavigate()

    const [forgot, setForgot] = useState({
        email: "",
        newPassword: "",
        question: "",
    })

    function handleUserInput(e) {
        const { name, value } = e.target
        setForgot({
            ...forgot,
            [name]: value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const res = axios.post(`${baseUrl}/api/v1/user/forgot-password`, { ...forgot });
            
            toast.promise(res, {
                loading: "Wait! Processing your request",
                success: (data) => {
                    // This function is called with the response of the promise
                    return data?.data?.message;
                },
                error: (err) => {
                    // This function is called with the error of the promise
                    return err.response?.data?.message || "Failed to reset password";
                }
            });
            const res1 = await res
            if (res1 && res1.data.success) {
            // Navigate to login page after successful password reset
            navigate("/login");
}



        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout title="Forgot password">
            <div className="form-containor">
                <form onSubmit={handleSubmit} action="">
                    <h4 className='mb-3 title'>Reset Password</h4>
                    <div className="form-group mb-2">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={forgot.email}
                            onChange={handleUserInput}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="newPassword"
                            value={forgot.newPassword}
                            onChange={handleUserInput}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="question"
                            name="question"
                            value={forgot.question}
                            onChange={handleUserInput}
                            placeholder="What is your favorite color?"
                        />
                    </div>

                    <button className="btn btn-primary">
                        Reset
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword;
