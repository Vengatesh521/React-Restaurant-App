import {useEffect, useState} from 'react'
import './index.css'

const RestaurantMenu = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [dishes, setDishes] = useState([])
  const [quantities, setQuantities] = useState({})
  const [cartCount, setCartCount] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [restaurantName, setRestaurantName] = useState('Restaurant')

  const dishesApiUrl =
    'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(dishesApiUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch menu data')
        }
        const data = await response.json()
        const menuList = data[0]?.table_menu_list || []
        setCategories(menuList)

        if (menuList.length > 0) {
          setSelectedCategory(menuList[0])
          setDishes(menuList[0].category_dishes)

          // Set restaurant name dynamically
          setRestaurantName(data[0]?.restaurant_name || 'Restaurant')

          // Initialize dish quantities to 0
          const initialQuantities = {}
          menuList.forEach(category => {
            category.category_dishes.forEach(dish => {
              initialQuantities[dish.dish_id] = 0
            })
          })
          setQuantities(initialQuantities)
        }
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  const handleCategoryClick = category => {
    setSelectedCategory(category)
    setDishes(category.category_dishes)

    // Reset the dish quantities to 0 for the new category
    const updatedQuantities = {}
    category.category_dishes.forEach(dish => {
      updatedQuantities[dish.dish_id] = quantities[dish.dish_id] || 0
    })
    setQuantities(updatedQuantities)
  }

  const handleQuantityChange = (dishId, action) => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[dishId] || 0
      const newQuantity =
        action === 'increment'
          ? currentQuantity + 1
          : Math.max(currentQuantity - 1, 0)

      const updatedQuantities = {...prevQuantities, [dishId]: newQuantity}

      // Update cart count dynamically
      const newCartCount = Object.values(updatedQuantities).reduce(
        (sum, qty) => sum + qty,
        0,
      )
      setCartCount(newCartCount)

      return updatedQuantities
    })
  }

  if (loading) {
    return <p>Loading menu...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className="menu-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>{restaurantName}</h1>
        <p>My Orders</p>
        <span className="cart-icon" role="img" aria-label="cart">
          🛒 {cartCount}
        </span>
      </nav>

      {/* Category Buttons */}
      <div className="category-list">
        {categories.map(category => (
          <button
            type="button"
            key={category.menu_category_id}
            className={`category-item ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.menu_category}
          </button>
        ))}
      </div>

      {/* Dish List */}
      <div className="dish-list">
        {dishes.map(dish => (
          <div key={dish.dish_id} className="dish-card">
            <h3>{dish.dish_name}</h3>
            <p>
              {dish.dish_currency} {dish.dish_price}
            </p>
            <p>{dish.dish_description}</p>
            <p role="paragraph">{dish.dish_calories} calories</p>
            {dish.addonCat.length > 0 && <p>Customizations available</p>}
            {!dish.dish_Availability && <p>Not available</p>}
            {dish.dish_Availability && (
              <div className="quantity-controls">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    handleQuantityChange(dish.dish_id, 'decrement')
                  }
                >
                  -
                </button>
                <p
                  data-testid={`quantity-${dish.dish_id}`}
                  className="quantity-text"
                >
                  {quantities[dish.dish_id] || 0}
                </p>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    handleQuantityChange(dish.dish_id, 'increment')
                  }
                >
                  +
                </button>
              </div>
            )}
            <img src={dish.dish_image} alt={dish.dish_name} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RestaurantMenu
