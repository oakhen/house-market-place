import { getAuth } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebase.config"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import { EditIcon } from "../assets/svg"

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, Setloading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        Setloading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }
  console.log(listing.user)

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        // spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(listing.imageUrls)}
      >
        {listing.imageUrls.map((url, i) => {
          return (
            <SwiperSlide key={i}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",

                  width: "100vw",
                  height: "50vh",
                }}
              ></div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000)

          // after pressing the share icon the link will be copied to the clipboard after 2 sec
        }}
      >
        <img src={shareIcon} alt="share icon" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name}- $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType"> For {listing.type.toUpperCase()}</p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedroom > 1 ? `${listing.bedroom} Bedrooms` : "1 Bedroom"}{" "}
          </li>
          <li>
            {listing.bathroom > 1
              ? `${listing.bathroom} Bathrooms`
              : "1 Bathroom"}{" "}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>

        {/* map will go here */}
        <div className="leafletContainer">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.user && (
          <Link
            className="primaryButton"
            // to={`contact/${listing.user}?listingName=${listing.name}`}
            to={`/contact/${listing.user}?listingName=${listing.name}`}
          >
            {/* create a link for email */}
            {/* i cannot see contact landloard button for my on posting */}
            Contact to Landloard
          </Link>
        )}
      </div>
    </main>
  )
}
export default Listing

3
