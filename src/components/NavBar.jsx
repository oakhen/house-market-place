import { useLocation, useNavigate } from "react-router-dom"
/* import reactcponent ExploreIcon PersonOutLine */

import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg"
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg"
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg"

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  /* ye location hook ka uuse kar ke hum pata lagenge ki hum kis location or agra location true hota hai to conditonally uska color change hoga */

  const activeNav = (path) => {
    if (location.pathname === path) {
      return true
    }
  }
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon
              fill={activeNav("/") ? "#2c2c2c" : "#8f8f8f"}
              width="36px"
              height="36px"
            />
            <p style={{ color: activeNav("/") ? "#2c2c2c" : "#8f8f8f" }}>
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offers")}>
            <OfferIcon
              fill={activeNav("/offers") ? "#2c2c2c" : "#8f8f8f"}
              width="36px"
              height="36px"
            />
            <p style={{ color: activeNav("/offers") ? "#2c2c2c" : "#8f8f8f" }}>
              Offers
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <PersonOutlineIcon
              fill={
                activeNav("/login") || activeNav("/profile")
                  ? "#2c2c2c"
                  : "#8f8f8f"
              }
              width="36px"
              height="36px"
            />
            <p
              style={{
                color:
                  activeNav("/login") || activeNav("/profile")
                    ? "#2c2c2c"
                    : "#8f8f8f",
              }}
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
export default NavBar
