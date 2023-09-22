import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { db } from "../../firebase.config"
import { toast } from "react-toastify"

function Contact() {
  const [message, setMessage] = useState()
  const [landlord, setLandlord] = useState(null)
  const [searchParams, setsearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandloard = async () => {
      const docRef = doc(db, "users", params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error("Could not load landlord data")
      }
    }
    getLandloard()
  }, [params.landlordId])

  console.log(searchParams.get("listingName"))
  const onchange = (e) => setMessage(e.target.value)

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlords</p>
      </header>

      {landlord && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">{landlord?.displayName}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLable">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={message}
                onChange={onchange}
                className="textarea"
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName",
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}
export default Contact
