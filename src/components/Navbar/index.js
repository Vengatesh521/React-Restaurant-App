import {Link} from 'react-router-dom'
import {useContext} from 'react'
import CartContext from '../../context/CartContext'

import './index.css'

const Navbar = ({restaurantName}) => {
  const {cartList} = useContext(CartContext)
  const cartCount = cartList.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" className="restaurant-name">
          {restaurantName}
        </Link>
      </h1>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        <Link data-testid="cart" to="/cart">
          <p>
            My Orders <span className="cart-count">({cartCount})</span>
          </p>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
