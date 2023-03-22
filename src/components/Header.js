import { Link, NavLink } from "react-router-dom"

const Header = () => {
  return (
    <header>
      <div id="headerAncors">
        <div id="logoContainer">
          <Link to='/'>LOGO</Link>
        </div>
        <nav>
          <NavLink to='/'>Sorting visualiser</NavLink>
        </nav>
      </div>
      <div>
        <button>Sign up</button>
      </div>
    </header>
  )
}

export default Header