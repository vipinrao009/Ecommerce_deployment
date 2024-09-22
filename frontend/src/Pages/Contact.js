import React from 'react'
import Layout from '../Layout/Layout'
import { Link } from 'react-router-dom'
import {BiMailSend, BiPhoneCall, BiSupport} from 'react-icons/bi'

const Contact = () => {
  return (
    <Layout title={'Contact us'}>
      <div className='contact-container'>
        <div className='contact-image col-md-6'>
          <img src="/images/contact1.jpg" alt="" width="500px" />
        </div>

        <div className='contact-content col-md-6'>
          <Link><p className='heading text-center'>Contact Us</p></Link>
          <p>Any query and info about product feel free to call anytime we are 24*7 available</p>
          <p><BiMailSend/> : www.help@ecommerceapp.com</p>
          <p><BiPhoneCall/> : 012-3456789</p>
          <p><BiSupport/> : 1800-0000-0000 (toll free)</p>
        </div>
      </div>
    </Layout>
  )
}

export default Contact
