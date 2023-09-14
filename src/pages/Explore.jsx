import { Link } from "react-router-dom"

import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg"
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg"

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        {/* slider */}
        <p className="exploreCategoryHeading">Catagories</p>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <img
              src={rentCategoryImage}
              alt="imgae for rent"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places For Rent </p>
          </Link>
          <Link to="/category/sale">
            <img
              src={sellCategoryImage}
              alt="image for sell"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places For Sale </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
export default Explore

/* bohot jada dimaag toh kaam nai kr raha hai but react router ke bare me baar baar baat sab bhul jaa rahe hai. */

/* HOME/:id  aise hum home ke baad koi v id dalenge to waha pe pohonch jaegen but humko wo parameter as id object ke andar milega*/
