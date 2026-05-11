import React from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonials from '../components/home/Testimonials'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'
import Navbar from '../components/home/Navbar'

const Home = () => {
  return (
    <div>
      <Banner/>
      <Navbar/>
      <Hero/>
      <Features/>
      <Testimonials/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home
