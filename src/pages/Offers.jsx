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
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const param = useParams()
  /* so yaha pe humko snapShot mil gaya hai right 
        now ab hum apna array create karenge  */

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings")

        /* Prepare a query  */

        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(1),

          //initially load 5 listings
        )

        const querySnap = await getDocs(q)

        // then get the listing length -1

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]

        setLastFetchedListing(lastVisible)
        console.log(lastVisible)

        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchListings()
  }, [])

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings")

      /* Prepare a query  */

      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(1),
      )

      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]

      setLastFetchedListing(lastVisible)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings((prev) => {
        return [...prev, ...listings]
      })
      setLoading(false)
    } catch (error) {}
  }

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
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No Available Offers yet</p>
      )}
    </div>
  )
}
export default Offers


/* create an array of 20 adress object */


