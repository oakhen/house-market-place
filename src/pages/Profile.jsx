import { Link, useNavigate } from "react-router-dom"
import { getAuth, updateProfile } from "firebase/auth"
import { useState, useEffect } from "react"

import { db } from "../../firebase.config"

import {
  updateDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  where,
  query,
  orderBy,
} from "firebase/firestore"
import { toast } from "react-toastify"
import { HomeIcon, KeyboardArrowRightIcon } from "../assets/svg"
import ListingItem from "../components/ListingItem"

function Profile() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(null)
  useEffect(() => {
    const fetchUserListing = async () => {
      const listingRef = collection(db, "listings")
      const q = query(
        listingRef,
        where("user", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
      )
      const querySnap = await getDocs(q)
      console.log("authId", auth.currentUser.uid)
      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListing(listings)
      setLoading(false)
    }

    fetchUserListing()
  }, [auth.currentUser.uid])

  const { name, email } = formData

  const onEdit = (id) => {
    navigate(`/edit-listing/${id}`)
  }

  const onDelete = async (id) => {
    if (window.confirm("Are You Sure You want to delete this")) {
      await deleteDoc(doc(db, "listings", id))

      const updatedListing = listing.filter((list) => {
        return list.id !== id
      })

      setListing(updatedListing)

      console.log(listing)
      toast.success("item deleted successfully")
    }
  }

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

  if (loading) return

  console.log(listing)
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
        {!loading && listing?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listing.map((item) => {
                return (
                  <ListingItem
                    key={item.id}
                    listing={item.data}
                    id={item.id}
                    onEdit={() => {
                      onEdit(item.id)
                    }}
                    onDelete={() => {
                      onDelete(item.id)
                    }}
                  />
                )
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  ) : (
    "not logged in "
  )
}
export default Profile
