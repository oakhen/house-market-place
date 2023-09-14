import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"
function Oauth() {
  const navigate = useNavigate()
  const location = useLocation()

  /* so jo yaha pe hum kr rahe hai usse humko lightly samajh aya hai. */

  const onGoogleAuth = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          displayName: user.displayName,
          timestamp: serverTimestamp(),
        })
      }
      navigate("/")
    } catch (error) {
      toast.error("Could not log you in")
    }
  }
  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/register" ? "up" : "in"} with</p>
      <button className="socialIconDiv" onClick={onGoogleAuth}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  )
}
export default Oauth
