import { useEffect, useState } from "react"

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore"

import { toast } from "react-toastify"
import { db } from "../../firebase.config"
import Spinner from "../components/Spinner"
import { useParams } from "react-router-dom"
import ListingItem from "../components/ListingItem"

function Offers() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const param = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings")

        /* Prepare a query  */

        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10),
        )

        const querySnap = await getDocs(q)

        /* so yaha pe humko snapShot mil gaya hai right 
        now ab hum apna array create karenge  */

        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })

          /* so maybe data ke andar sab kuch hai par id nai hai so uske liye humko ek workaround karna hoga
           */
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchListings()
  }, [])

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Available Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                )
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>No Available Offers yet</p>
      )}
    </div>
  )
}
export default Offers
