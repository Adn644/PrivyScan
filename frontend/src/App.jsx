import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Analysis from './pages/Analysis'
  import Results from './pages/Results'

const SiteLayout = () => {
  return (
    <div className="h-[100vh]">
      <main className="">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  )
}

const App = () => {
  return (
    <Router>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
                     <Route path="/results" element={<Results />} />
          </Route>
        </Routes>
    </Router>
  )
}

export default App;