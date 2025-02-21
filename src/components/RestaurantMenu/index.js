import {useState, useEffect} from 'react'
import './index.css'

export default function RestaurantMenu() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setCategories(data[0].table_menu_list)

        if (data[0].table_menu_list.length > 0) {
          const firstCategory = data[0].table_menu_list[0]
          setSelectedCategory(firstCategory)
          setDishes(firstCategory.category_dishes)
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
  }

  const handleQuantityChange = (dishId, action) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [dishId]:
        action === 'increment'
          ? (prevQuantities[dishId] || 0) + 1
          : Math.max((prevQuantities[dishId] || 0) - 1, 0),
    }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>
  }

  return (
    <div className="container mt-3">
      {/* Navbar */}
      <nav className="navbar">
        <h1>UNI Resto Cafe</h1>
        <p>My Orders</p>
        <span className="cart-icon"> 🛒</span>
      </nav>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <h1
            key={category.menu_category_id}
            className={`category-item ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.menu_category}
          </h1>
        ))}
      </div>

      {/* Selected Category Dishes */}
      {selectedCategory && (
        <div className="mt-4">
          <h2>{selectedCategory.menu_category}</h2>
          <ul className="list-group">
            {dishes.map(dish => (
              <li key={dish.dish_id} className="list-group-item">
                {/* Veg/Non-Veg Symbol */}
                <img
                  src={
                    dish.dish_Type === 2
                      ? 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Non_veg_symbol.svg'
                      : 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Veg_symbol.svg'
                  }
                  alt={dish.dish_Type === 2 ? 'Non-Veg' : 'Veg'}
                  className="veg-nonveg-icon"
                />

                {/* Dish Details */}
                <div className="dish-details">
                  <h3>{dish.dish_name}</h3>
                  <p>{dish.dish_description}</p>
                  <p>
                    <strong>Price:</strong> {dish.dish_currency}{' '}
                    {dish.dish_price}
                  </p>
                  <p>
                    <strong>Calories:</strong> {dish.dish_calories}
                  </p>
                  {dish.dish_Availability ? (
                    <p className="text-success">Available</p>
                  ) : (
                    <p className="text-danger">Not Available</p>
                  )}

                  {/* Quantity Controls */}
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
                    <span>{quantities[dish.dish_id] || 0}</span>
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
                </div>

                {/* Dish Image */}
                <div className="text-end">
                  <img
                    src={dish.dish_image || 'https://i.imgur.com/PoJfqsD.jpg'}
                    alt={dish.dish_name}
                    className="dish-image"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
