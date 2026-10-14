import {createBrowserRouter,RouterProvider} from 'react-router'
import Home from './screens/Home.jsx'
import Signin from './screens/Signin.jsx'
import Signup from './screens/Signup.jsx'
import ProductDetails from './screens/ProductDetails.jsx'
import Cart from './screens/Cart.jsx'
import Checkout from './screens/Checkout.jsx'
import MyOrders from './screens/MyOrders.jsx'
import ProductList from './admin/ProductList.jsx'
import AddProduct from './admin/AddProduct.jsx'
import EditProduct from './admin/EditProduct.jsx'
import OrderList from './admin/OrderList.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return <RouterProvider router={router} />
}

const router = createBrowserRouter([ // router set karne ke liye new approach
  {path:"/",element:<Signin/>},
  {path:"/signup",element:<Signup/>},
  {path:"/home",element:<Home/>},
  {path:"/product/:id",element:<ProductDetails/>},
  {path:"/cart",element:<Cart/>},
  // pages that need login
  {path:"/checkout",element:<ProtectedRoute><Checkout/></ProtectedRoute>},
  {path:"/orders",element:<ProtectedRoute><MyOrders/></ProtectedRoute>},
  // admin pages (only admin can open them)
  {path:"/admin/products",element:<AdminRoute><ProductList/></AdminRoute>},
  {path:"/admin/products/add",element:<AdminRoute><AddProduct/></AdminRoute>},
  {path:"/admin/products/:id/edit",element:<AdminRoute><EditProduct/></AdminRoute>},
  {path:"/admin/orders",element:<AdminRoute><OrderList/></AdminRoute>}
])