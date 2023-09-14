import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"

function ForgotPassWord() {
  const [email, setEmail] = useState("")

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const auth = getAuth()

    if (email) {
      await sendPasswordResetEmail(auth, email)
    }

    toast.success("An Email To Reset Password Has Been Sent")
    navigate("/login")

    try {
    } catch (error) {
      toast.error("Something Went Wrong")
    }
  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="emailInput"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Link className="forgotPasswordLink" to="/login">
            Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
export default ForgotPassWord
