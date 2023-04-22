import { NavLink } from "react-router-dom"

const Header = () => {
  return (
    <header>
        <div id="logoContainer">
          <img src="favicon.png"/>
          <h1>Algorithmic Perspective</h1>
        </div>
        <nav id="headerAncors">
          <NavLink to='/'>Sorting visualiser</NavLink>
        </nav>
    </header>
  )
}

export default Header