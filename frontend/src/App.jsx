import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'

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
          </Route>
        </Routes>
    </Router>
  )
}

export default App;