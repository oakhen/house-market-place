import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { toast } from "react-toastify"
import { v4 as uid } from "uuid"
import Spinner from "../components/Spinner"

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import { serverTimestamp, getDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase.config"

function EditListing() {
  const [loading, setLoading] = useState(false)
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [listing, setListing] = useState(null)

  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    longitude: 0,
    latitude: 0,
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    longitude,
    latitude,
  } = formData
  const auth = getAuth()
  const navigate = useNavigate()
  const { listingId } = useParams()

  useEffect(() => {
    if (listing && listing.user !== listingId) {
      toast.error("You cannot edit the listing")
      navigate("/")
    }
  }, [listingId])

  useEffect(() => {
    const fetchUserListing = async () => {
      const docRef = doc(db, "listings", listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setFormData({ ...docSnap.data(), address: docSnap.data().location })
        setLoading(false)
      } else {
        navigate("/")
        toast.error("Listing not found")
      }
    }
    fetchUserListing()
  }, [listingId, navigate])

  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // user logged in
          setFormData({
            ...formData,
            user: user.uid,
          })
        } else {
          navigate("/login")
        }
      })
    }

    return () => (isMounted.current = false)
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (discountedPrice >= regularPrice) {
      toast.error("Discounted price needs to be less than regular price")
      setLoading(false)
      return
    }

    if (images.length > 6) {
      setLoading(false)
      toast.error("Max 6 images")
      setLoading(false)
      return
    }

    // // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uid()}`

        const storageRef = ref(storage, "images/" + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log("Upload is " + progress + "% done")
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused")
                break
              case "running":
                console.log("Upload is running")
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          },
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image)),
    ).catch(() => {
      setLoading(false)
      toast.error("Images not uploaded")
      return
    })

    let geolocation = {}
    let location

    if (geolocationEnabled) {
      const response = await fetch(
        `https://geocode.maps.co/search?q=${address}`,
      )
      const data = await response.json()

      geolocation.lat = data[0]?.lat ?? 0
      geolocation.lng = data[0]?.lon ?? 0
      location = data[0]?.display_name
      if (!location) {
        setLoading(false)
        toast.error("Please enter valid location")
        return
      }
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
      location = address // reverse geolocation v use kr sakte hai
    }
    // copy of the data object
    const formDataCopy = {
      ...formData,
      imageUrls: imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    // sanitize the data

    delete formDataCopy.images // coz those are local image name
    delete formDataCopy.address // that we will get from geolocations
    location && (formDataCopy.location = location) // location is fetched from geolocations or set to manual adress
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef = doc(db, "listings", listingId)

    const updateListing = await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success("Listing created")
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    //  which is not been created yet
  }

  const onMutate = (e) => {
    let bool = null
    if (e.target.value === "true") bool = true

    if (e.target.value === "false") bool = false

    if (e.target.files) {
      setFormData((prevState) => {
        return {
          ...prevState,
          images: e.target.files, //its an array
        }
      })
    }
    if (!e.target.files) {
      setFormData((prevState) => {
        return {
          ...prevState,
          [e.target.id]: bool ?? e.target.value, // boolean or value
        }
      })
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Linstings</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell/Rent</label>
          <div className="formButtons">
            <button
              className={type === "sale" ? "formButtonActive" : "formButton"}
              type="button"
              id="type"
              value={"sale"}
              onClick={onMutate}
            >
              Sale
            </button>
            <button
              className={type === "rent" ? "formButtonActive" : "formButton"}
              type="button"
              id="type"
              value={"rent"}
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />
          {/* address abhi manual add kar rahe hai uske liye form hai nai to nai to wo geolocation se hojaeg */}
          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {offer && (
            <div className="formPriceDiv">
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
              {type === "rent" && <p className="formPriceText">$ / Month</p>}
            </div>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  )
}

export default EditListing
