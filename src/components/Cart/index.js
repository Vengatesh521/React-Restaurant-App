import {useContext} from 'react'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import CartItem from '../CartItem'
import './index.css'

const Cart = () => {
  const {cartList, removeAllCartItems} = useContext(CartContext)

  const renderEmptyView = () => (
    <div className="empty-cart">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
        alt="empty cart"
        className="empty-cart-image"
      />
      <p>Your cart is empty</p>
    </div>
  )

  const renderCartItems = () => (
    <div data-testid="cart">
      <div className="cart-header">
        <h1>Cart Items</h1>
        <button
          type="button"
          onClick={removeAllCartItems}
          className="remove-all"
          data-testid="remove-all"
        >
          Remove All
        </button>
      </div>
      <ul className="cart-items-list">
        {cartList.map(dish => (
          <CartItem key={dish.dishId} cartItemDetails={dish} />
        ))}
      </ul>
    </div>
  )

  return (
    <div>
      <Header />
      <div className="cart-container">
        {cartList.length === 0 ? renderEmptyView() : renderCartItems()}
      </div>
    </div>
  )
}

export default Cart
