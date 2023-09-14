import { Route, Routes } from "react-router-dom"

import {
  Explore,
  Offers,
  Login,
  Register,
  Profile,
  ForgotPassWord,
  Category,
} from "./pages"
import NavBar from "./components/NavBar"
import { ToastContainer } from "react-toastify"
/* import react toastify css */
import "react-toastify/dist/ReactToastify.css"
import PrivateRoute from "./components/PrivateRoute"
import CreateListings from "./pages/CreateListings"

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Explore />} />
        <Route exact path="/offers" element={<Offers />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/category/:categoryName" element={<Category />} />
        <Route exact path="/create-listing" element={<CreateListings />} />
        <Route exact path="/profile" element={<PrivateRoute />}>
          <Route exact path="/profile" element={<Profile />} />
        </Route>
        <Route exact path="/forgot-password" element={<ForgotPassWord />} />
      </Routes>
      <NavBar />
      <ToastContainer />
    </>
  )
}

export default App
