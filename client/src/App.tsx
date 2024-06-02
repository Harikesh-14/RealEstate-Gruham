import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
// import Home from './pages/Home'
import AdminRegister from './pages/AdminRegister'
import AdminLogin from './pages/AdminLogin'
import VendorLogin from './pages/VendorLogin'
import AdminDashboard from './container/AdminDashboard'
import AdminLayout from './AdminLayout'
import AdminManageVendors from './container/AdminManageVendors'

function App() {
  return (
    <>
      <Routes>
        <Route path='/admin' element={<AdminLayout />} >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='manage-vendors' element={<AdminManageVendors />} />
        </Route>
        <Route path='/admin/register' element={<AdminRegister />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        <Route path='/' element={<Layout />} >
          <Route index element={<VendorLogin />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
