import React from 'react'
import Layout from '../Layout/Layout'

const Policy = () => {
  return (
    <Layout title={'Privacy policy'}>
      <div className='privacy-container'>
        <div className='image'>
        <img
            src="/images/privacy-policy.webp"
            alt="contactus"
            style={{ width: "90%" }}
          />
        </div> 

        <div className='privacy-content'>
        <p>We use your information to:</p>
        <ul>
            <li>Provide and maintain our service, including customer support.</li>
            <li>Improve and personalize your experience on our site.</li>
            <li>Communicate with you about updates, promotions, and other information related to our services.</li>
            <li>Understand how our website is used and how we can improve it.</li>
        </ul>
        </div>       
      </div>
    </Layout>
  )
}

export default Policy
