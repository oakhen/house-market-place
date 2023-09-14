import { Link } from "react-router-dom"
import { DeleteIcon } from "../assets/svg"

import bedIcon from "../assets/svg/bedIcon.svg"
/* import bathetubIcon */
import bathtubIcon from "../assets/svg/bathtubIcon.svg"

function ListingItem({ listing, id, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        className="categoryListingLink"
        to={`/category/${listing.type}/${id}`}
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            {" "}
            $
            {listing.offer ? (
              <>
                <div style={{ textDecoration: "line-through" }}>
                  {listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                {"  -> "}
                {listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </>
            ) : (
              listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            )}
            {listing.type === "rent" && " / Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bathtub" />
            <p className="categoryListingInfoText">
              {listing.bathroom > 1
                ? `${listing.bathroom} Bathrooms`
                : "1 Bathroom"}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          onClick={() => onDelete(listing.id, listing.name)}
          className="removeIcon"
          fill="rgb(231,76,60)"
        />
      )}
    </li>
  )
}
export default ListingItem
