import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage'
import TermsAndPrivacy from './Pages/Terms/terms'

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
