import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'
import{ toast} from 'react-hot-toast'
import SearchInput from '../components/Form/SearchInput'
import useCategory from '../hook/useCategory'
import { useCart } from '../Context/cart'
import { Badge } from 'antd'

const Header = () => {
    const [auth,setAuth] = useAuth();
    const navigate = useNavigate()
    const categories = useCategory()
    const [cart] = useCart()

    async function handleLogout(){
        setAuth({
            ...auth,
            user:null,
            token:""
        })

        localStorage.removeItem("auth")
        await toast.success("Logout successfully...")
        navigate('/')
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <Link to="/" className="navbar-brand">
                        Ecommerce app
                    </Link>
                    <SearchInput/>
                    <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">
                            Home
                            </NavLink>
                        </li>

                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                to={"/categories"}
                                data-bs-toggle="dropdown"
                            >
                                Categories
                            </Link>
                            <ul className='dropdown-menu'>
                                <li>
                                    <Link className='dropdown-item' to={'/categories'}>All category</Link>
                                </li>
                                {categories?.map((category)=>(
                                    <li>
                                        <Link className='dropdown-item' to={`/category/${category?.slug}`}>{category.name}</Link>
                                    </li>
                                ))}
                            </ul>

                        </li>

                        {!auth.user ? (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link">
                                    Register
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">
                                    Login
                                    </NavLink>
                                </li>
                            </>
                        ): (
                            <>
                                <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {auth?.user?.name}
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                    <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item" href="#">
                                        Dashboard
                                    </NavLink>
                                    </li>
                                
                                    <li>
                                    <hr className="dropdown-divider" />
                                    </li>

                                    <li>
                                    <NavLink onClick={handleLogout} to={'login'} className="dropdown-item">
                                    Logout
                                    </NavLink>
                                    </li>
                                    
                                </ul>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Badge count={cart?.length} showZero>
                                <NavLink to="/cart" className="nav-link">
                                Cart
                                </NavLink>
                            </Badge>
                        </li>
                    </ul>
                </div>
                </div>
            </nav>

        </>
    )
}

export default Header
