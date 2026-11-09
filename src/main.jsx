import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import SiteLayout from './components/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import RequestSeal from './pages/RequestSeal.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import AdminApp from './admin/AdminApp.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="request-seal" element={<RequestSeal />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
