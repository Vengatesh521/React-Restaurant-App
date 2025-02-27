import {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import CartContext from './context/CartContext'
import Home from './components/Home'
import CartRoute from './components/CartRoute'
import Navbar from './components/Navbar'

class App extends Component {
  state = {
    cartList: [],
    restaurantName: 'UNI Resto Cafe', // Move restaurantName to App.js
  }

  setRestaurantName = name => {
    this.setState({restaurantName: name})
  }

  addCartItem = product => {
    this.setState(prevState => {
      const productExists = prevState.cartList.find(
        item => item.id === product.id,
      )

      if (productExists) {
        const updatedCartList = prevState.cartList.map(item =>
          item.id === product.id
            ? {...item, quantity: item.quantity + product.quantity}
            : item,
        )
        return {cartList: updatedCartList}
      }
      return {
        cartList: [
          ...prevState.cartList,
          {...product, quantity: product.quantity || 1},
        ],
      }
    })
  }

  removeCartItem = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(item => item.id !== productId),
    }))
  }

  incrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(item =>
        item.id === productId ? {...item, quantity: item.quantity + 1} : item,
      ),
    }))
  }

  decrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList
        .map(item =>
          item.id === productId ? {...item, quantity: item.quantity - 1} : item,
        )
        .filter(item => item.quantity > 0), // Remove items with quantity <= 0
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList, restaurantName} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Router>
          <Navbar restaurantName={restaurantName} />
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Home setRestaurantName={this.setRestaurantName} />}
            />
            <Route exact path="/cart" component={CartRoute} />
          </Switch>
        </Router>
      </CartContext.Provider>
    )
  }
}

export default App
