import {useEffect, useState, useContext} from 'react'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import DishItem from '../DishItem'
import './index.css'

const Home = () => {
  const {cartList, setRestaurantName, addCartItem, removeCartItem} = useContext(
    CartContext,
  )
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [response, setResponse] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const dishesApiUrl =
    'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

  const getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCart: eachDish.addonCat,
      })),
    }))

  const fetchRestaurantApi = async () => {
    try {
      const apiResponse = await fetch(dishesApiUrl)
      const data = await apiResponse.json()
      const updatedData = getUpdatedData(data[0]?.table_menu_list || [])
      setResponse(updatedData)
      setRestaurantName(data[0].restaurant_name)
      setActiveCategoryId(updatedData[0]?.menuCategoryId || '')
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching restaurant data:', error)
    }
  }

  useEffect(() => {
    fetchRestaurantApi()
  }, [])

  const onUpdateActiveCategoryId = menuCategoryId => {
    setActiveCategoryId(menuCategoryId)
  }

  const renderTabMenuList = () =>
    response.map(eachCategory => {
      const onClickHandler = () => {
        onUpdateActiveCategoryId(eachCategory.menuCategoryId)
      }
      const isActive = eachCategory.menuCategoryId === activeCategoryId

      return (
        <li
          className={`each-tab-item ${isActive ? 'active-tab-item' : ''}`}
          key={eachCategory.menuCategoryId}
        >
          <button
            type="button"
            className="mt-0 mb-0 ml-2 mr-2 tab-category-button"
            onClick={onClickHandler}
            aria-pressed={isActive}
          >
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })

  const renderDishes = () => {
    const activeCategory = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    return (
      <ul className="m-0 d-flex flex-column dishes-list-container">
        {activeCategory?.categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            addItemToCart={addCartItem}
            removeItemFromCart={removeCartItem}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  return isLoading ? (
    renderSpinner()
  ) : (
    <div className="home-background">
      <Header cartItems={cartList} />
      <ul className="m-0 ps-0 d-flex tab-container">{renderTabMenuList()}</ul>
      {renderDishes()}
    </div>
  )
}

export default Home
