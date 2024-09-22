import React from 'react'
import Layout from '../Layout/Layout'

const About = () => {
  return (
    <Layout title={'about'}>
      <div className='container'>
        <div className='image'>
        <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div> 

        <div className='content'>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore quis perspiciatis rerum voluptate, nemo non ut doloremque soluta, quae rem ab minima. Quo maiores itaque praesentium nulla, sed ipsum officia sint, illo quidem, omnis dolore voluptatem eaque nostrum eligendi tempore.</p>
        </div>       
      </div>
    </Layout>
  )
}

export default About
