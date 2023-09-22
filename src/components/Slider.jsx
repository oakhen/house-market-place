import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useEffect, useState } from "react"
import { db } from "../../firebase.config"
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore"
import "swiper/swiper-bundle.css"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import Spinner from "./Spinner"
import { useNavigate } from "react-router-dom"

function Slider() {
  const [loading, setloading] = useState(true)
  const [listing, setListing] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchListing = async () => {
      const listingRef = collection(db, "listings")
      const q = query(listingRef, orderBy("timestamp", "asc"), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListing(listings)
      setloading(false)
      console.log(listing)
    }
    fetchListing()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listing.length === 0) {
    return <></>
  }

  return (
    listing && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          // spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(listing.imageUrls)}
        >
          {listing.map(({ data, id }) => {
            return (
              <SwiperSlide
                key={id}
                onClick={() => {
                  navigate(`/category/${data.type}/${id}`)
                }}
              >
                <div
                  style={{
                    background: `url(${data.imageUrls[0]}) center/cover no-repeat`,
                    backgroundSize: "cover",
                    width: "100vw",
                    height: "50vh",
                  }}
                  className="swiperSlideDiv"
                >
                  <p className="swiperSlideText">{data.name}</p>
                  <p className="swiperSlidePrice">
                    ${data.discountedPrice ?? data.regularPrice}{" "}
                    {data.type === "rent" && "/ month"}
                  </p>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </>
    )
  )
}
export default Slider

/* so mereko yaha pe samajhna pageda ki basically yaha pe ho kya raha hai.  */
