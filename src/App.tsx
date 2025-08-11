<<<<<<< HEAD
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage'
import TermsAndPrivacy from './Pages/Terms/terms'
=======
import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
>>>>>>> 9f64054b0f6970554ce1c30b2da0c0094adf83b9

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/terms' element={<TermsAndPrivacy/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
