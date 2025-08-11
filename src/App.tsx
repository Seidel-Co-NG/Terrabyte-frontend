import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import TermsPrivacy from './Pages/Terms/terms'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/terms' element={<TermsPrivacy />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
