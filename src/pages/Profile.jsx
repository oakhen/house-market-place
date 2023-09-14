import { Link, useNavigate } from "react-router-dom"
import { getAuth, updateProfile } from "firebase/auth"
import { useState } from "react"

import { db } from "../../firebase.config"

import { updateDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify"
import { HomeIcon, KeyboardArrowRightIcon } from "../assets/svg"

function Profile() {
  /* so ye profile hai aur isme profile update karne ka feature hai
  par isme kewal display name and email hi change karenge */
  const navigate = useNavigate()
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const { name, email } = formData

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name })
        /* so ye firebase/auth ka update task hua */

        const userRef = await doc(
          db,
          "users",
          auth.currentUser.uid,
          // "user.uid",
        ) /* so yaha pe hum refrence le liye ki kaya update krna hai */
        await updateDoc(userRef, { name })
      }
    } catch (error) {
      toast.error("Could not update profile Details")
      console.log(error)
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  return formData.name && formData.email ? (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>

        <button
          type="button"
          onClick={() => {
            auth.signOut()
            navigate("/")
          }}
          className="logOut"
        >
          Log Out
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details </p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              name="name"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              name="email"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <HomeIcon />
          <p>Sell or Rent your home</p>
          <KeyboardArrowRightIcon />
        </Link>
      </main>
    </div>
  ) : (
    "not logged in "
  )
}
export default Profile
