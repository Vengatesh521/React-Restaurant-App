import {useState, useContext} from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

const DishItem = ({dishDetails}) => {
  const {
    dishName,
    dishType,
    dishPrice,
    dishCurrency,
    dishDescription,
    dishImage,
    dishCalories,
    addonCat,
    dishAvailability,
  } = dishDetails

  const [quantity, setQuantity] = useState(0)
  const {addCartItem} = useContext(CartContext)

  const onIncreaseQuantity = () => setQuantity(prev => prev + 1)
  const onDecreaseQuantity = () =>
    setQuantity(prev => (prev > 0 ? prev - 1 : 0))
  const onAddItemToCart = () => {
    if (quantity > 0 && dishAvailability) {
      // Only add if available and quantity > 0
      addCartItem({...dishDetails, quantity})
      setQuantity(0)
    }
  }

  const renderControllerButton = () => (
    <div className="controller-container d-flex align-items-center">
      <button className="button" type="button" onClick={onDecreaseQuantity}>
        -
      </button>
      <p className="quantity m-0">{quantity}</p>
      <button className="button" type="button" onClick={onIncreaseQuantity}>
        +
      </button>
    </div>
  )

  return (
    <li className="mb-3 p-3 dish-item-container d-flex">
      <div className="dish-info-container">
        <div
          className={`veg-round ${
            dishType === 'NON_VEG' ? 'non-veg-round' : ''
          }`}
        />
        <div className="dish-details-container">
          <h1 className="dish-name">{dishName}</h1>
          <p className="dish-currency-price">
            {dishCurrency} {dishPrice}
          </p>
          <p className="dish-description">{dishDescription}</p>
          {dishAvailability ? (
            renderControllerButton()
          ) : (
            <>
              <p className="not-availability-text text-danger">0</p>
              <p className="not-availability-text text-danger">Not Available</p>
            </>
          )}
          {addonCat?.length > 0 && (
            <p
              className="addon-availability-text mb-0"
              data-testid="customizations-available"
            >
              Customizations available
            </p>
          )}
          {quantity > 0 && dishAvailability && (
            <button
              type="button"
              className="btn btn-outline-primary mt-3"
              onClick={onAddItemToCart}
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
      <div className="dish-image-container">
        <p className="dish-calories text-warning">{dishCalories} calories</p>
        <img className="dish-image" alt={dishName} src={dishImage} />
      </div>
    </li>
  )
}

export default DishItem
