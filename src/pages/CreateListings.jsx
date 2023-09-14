import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/Spinner"
import { getAuth, onAuthStateChanged } from "firebase/auth"

function CreateListings() {
  const [loading, setLoading] = useState(false)
  const [geolocationEnabled, setGeolocationEnabled] = useState(true) // so humlog google geocoding ka use karne wale hai or agar wo nai hai to ye false hoga and humlog manual logitude and latitude dalenge
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
    images: {},
    logitude: 0,
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
    logitude,
    latitude,
  } = formData
  const auth = getAuth()
  const navigate = useNavigate()

  const isMounted = useRef(true) // useRef ek aisa hook hai jiske andar ka state change hone pe rerender nai hota hai.

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        /* sabse pehle hum yaha pe kya kar rahe hai ki hum dekhenge ki user loggedin hai ki nai, agar hai to  */

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

    return () => (isMounted.current = false) // on componentDidUnmount pe hum bataenge ki ismounted ko false kar do
  }, [isMounted])

  const onMutate = (e) => {
    /* so ye function alone will take care my entire formData  */
    /* so hum yaha pe bohot jada lazyness dikha rahe hai. dimaag thik se kaam nai kar raha hai */

    setFormData({
      ...formData,
    })

    /* so ye alone ek aisa function jo sare input type ko bhar sakta hai. */

    /* ===============================================start from here */
    /* this function contains too much logic thats why i will have to completely understand this function */
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create Linstings</p>
      </header>
      <main>
        <form>
          <label className="formLabel">Sell/Rent</label>
          <div className="formButtons">
            <button
              className={type === "sale" ? "formButtonActive" : "formButton"}
              type="button"
              id="sale"
              onClick={onMutate}
            >
              Sale
            </button>
            <button
              className={type === "rent" ? "formButtonActive" : "formButton"}
              type="button"
              id="rent"
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

          {/* input type file pe kavi kaam nai kiye the this is interesting */}
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}
export default CreateListings
