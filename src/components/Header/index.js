import {Link, withRouter} from 'react-router-dom'
import {useContext} from 'react'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import Cookies from 'js-cookie'
import CartContext from '../../context/CartContext'
import './index.css'

const Header = () => {
  const {cartList, restaurantName} = useContext(CartContext)
  const cartCount = cartList.length

  const onLogout = () => {
    Cookies.remove('jwt_token')
    window.location.replace('/login')
  }

  const renderCartIcon = () => (
    <div className="cart-icon-link">
      <Link data-testid="cart" to="/cart">
        <button type="button" className="cart-icon-button">
          <AiOutlineShoppingCart className="cart-icon" />
        </button>
      </Link>
      {cartCount > 0 && (
        <div className="cart-count-badge d-flex justify-content-center align-items-center">
          <p className="m-0 cart-count">{cartCount}</p>
        </div>
      )}
    </div>
  )

  return (
    <header className="p-4 d-flex flex-row align-items-center nav-header">
      <Link to="/" className="restaurant-name">
        <h1 className="m-0 logo-heading">{restaurantName}</h1>
      </Link>
      <div className="d-flex flex-row align-items-center ml-auto">
        <Link
          to="/cart"
          className="mt-0 mb-0 mr-2 d-none d-sm-block my-order-text"
        >
          My Orders
        </Link>
        {renderCartIcon()}
        <button
          onClick={onLogout}
          type="button"
          className="btn btn-outline-danger ml-2 btn-sm"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default withRouter(Header)
