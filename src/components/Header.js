import { Link, NavLink } from "react-router-dom"

const Header = () => {
  return (
    <header>
        <div id="logoContainer">
          <h1>logo</h1>
        </div>
        <nav id="headerAncors">
          <NavLink to='/'>Sorting visualiser</NavLink>
        </nav>
    </header>
  )
}

export default Header