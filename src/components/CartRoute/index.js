import {useContext} from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

const CartRoute = () => {
  const {
    cartList,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    removeAllCartItems,
  } = useContext(CartContext)

  return (
    <div className="cart-container">
      <h2>My Cart</h2>
      {cartList.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
            alt="empty cart"
            className="empty-cart-image"
          />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={removeAllCartItems}
            className="remove-all"
          >
            Remove All
          </button>
          <ul>
            {cartList.map(item => (
              <li key={item.id} className="cart-item">
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => decrementCartItemQuantity(item.id)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementCartItemQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeCartItem(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default CartRoute
