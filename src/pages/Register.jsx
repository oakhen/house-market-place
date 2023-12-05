import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

import { setDoc, doc, serverTimestamp } from "firebase/firestore"

/* so crud operation ke liye humko jo jo functions chahiye wo hum import karenge 
firestore */
import { db } from "../../firebase.config"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { KeyboardArrowRightIcon } from "../assets/svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import { toast } from "react-toastify"
import Oauth from "./Oauth"

function Register() {
  const navigate = useNavigate()

  const [showPassword, SetshowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const { name, email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredi = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      const user = userCredi.user
      updateProfile(auth.currentUser, {
        displayName: name,
      })
      const formDataCopy = { ...formData, timestamp: serverTimestamp() }
      delete formDataCopy.password
      setDoc(doc(db, "users", user.uid), formDataCopy)
      navigate("/")
    } catch (error) {
      toast.error("Something went wrong ,may be password too small")
      console.log(error)
    }
  }
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="nameInput"
            name="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="emailInput"
            name="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            {/* yaha pe div issiliye hai kyun ki password input ke andar hi ek button jaega */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              className="passwordInput"
              name="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt=""
              className="showPassword"
              onClick={() => {
                SetshowPassword((prevState) => !prevState)
              }}
            />
            <Link to={"/forgot-password"} className="forgotPasswordLink">
              Forgot Password?
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign Up</p>
              <button className="signInButton">
                <KeyboardArrowRightIcon
                  fill="#ffff"
                  width="34px"
                  height="34px"
                />
              </button>
            </div>
          </div>
        </form>
        <Oauth />

        <Link className="registerLink" to={"/login"}>
          Sign In Instead
        </Link>
      </div>
    </>
  )
}

export default Register
