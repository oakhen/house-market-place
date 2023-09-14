import { Navigate, Outlet } from "react-router-dom"
// import { useAuthState } from "../hooks/useAuthState"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useRef, useState } from "react"
import Spinner from "./Spinner"

const PrivateRoute = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
      }
      setCheckingStatus(false)
    })
  }, [])

  /* so agar user logged in hai to provile  otherwise redirect to login */

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to="/login" />
}
export default PrivateRoute

/* ye itna shortcut me aur bina thik se explain kiye chizo ko paar kar raha hai 
ki ye dikkat ka baat hais */
