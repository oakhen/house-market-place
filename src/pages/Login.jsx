import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { KeyboardArrowRightIcon } from "../assets/svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"

import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import Oauth from "./Oauth"

/* dekho huko ye pata tha ki ye bohot kuch samajn nai wala ye just copypaste karte hai so jo main hai wo humhi ko drill karna hai. */

function Login() {
  const navigate = useNavigate()
  const [showPassword, SetshowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { email, password } = formData

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      if (userCredential.user) {
        toast.success("Login Successful")

        navigate("/")
      }
    } catch (error) {
      console.log(error)
      toast.error("Wrong username or password")
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
              <p className="signInText">Sign In</p>
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

        <Link className="registerLink" to={"/register"}>
          Sign Up Instead
        </Link>
      </div>
    </>
  )
}

export default Login
