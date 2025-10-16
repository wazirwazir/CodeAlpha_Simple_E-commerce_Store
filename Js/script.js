const formSubmitBtn = document.querySelector('form')
const navBtn = document.querySelector('.hamburger')
const navBar = document.querySelector('#navBar')
const cartContainer = document.querySelector('.cartContainer')
const cartBtn = document.querySelector('.checkCart')
const eNumberInput = document.querySelector('#e-number')
const ePinInput = document.querySelector('#e-Pin')
const sectionName = document.querySelector('#section_name')
let productsContainer = document.querySelector('.items_sold')
const removeAllBtn = document.querySelector('.removeBtn')
const logoutBtn = document.querySelector('#logout')
let products;
let user;
let cartedProducts;



//save user info from db for use
const saveUserProfile = (e) => {
  user = e
}

//load products from db
if (productsContainer) {
    fetch('https://audiophile-ecommerce-api-1zr9.onrender.com/')
    .then(response => response.json())
    .then(data => {
      console.log(data)
        products = data.filter(item => item.category == sectionName.innerText.toLocaleLowerCase())
        renderProducts(products)
        //renderCartedProducts()
        itemQuantity()
    })
    .catch(err => console.error(err))
}

//get user from db after login then get users items from cart
const getUserProfile = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    window.location.href = 'index.html'
  }
  fetch(`https://audiophile-ecommerce-api-1zr9.onrender.com/profile/${userId}`)
  .then(response => response.json())
  .then(data => {
    saveUserProfile(data)
    return fetch('https://audiophile-ecommerce-api-1zr9.onrender.com/carted', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: data.id
        })
    })
    .then(response => response.json())
    .then(data => {console.log(data)
      cartedProducts = data
      renderCartedProducts()
      return data
    })
    
  })
}

//handle navbar and cart display
const displayNav = () => {
    if (!cartContainer.classList.contains('hide')) {
        cartContainer.classList.toggle('hide')
    }
    navBar.classList.toggle('hide')
}

const displayCart = () => {
    
    if (!navBar.classList.contains('hide')) {
        navBar.classList.toggle('hide')
        cartCounter()
    }
    cartContainer.classList.toggle('hide')
}

navBtn.onclick = displayNav
cartBtn.onclick = displayCart

//check if rendered product is new
const checkNewProduct = (e) => {if(e.new == true) {return 'new product'} else{return ''}}

//render products
const renderProducts = (products) => {
  console.log(products)
    productsContainer.innerHTML = products.map(item => {
        return `<div class="itemSold">
                <div class="img">
                    <img src="${item.image.desktop}" alt="speaker">
                </div>
                <div class="about">
                    <p class="product-status">${checkNewProduct(item)}</p>
                    <h2>
                        <span>${item.name}</span> <br> <span>${item.category}</span>
                    </h2>
                    <p>${item.description}</p>
                    <p class="item_price">
                        $<span id="itemPrice">${item.price.toLocaleString()}</span>
                    </p>
                    <div class="add_to_cart_container">
                        <div class="item_quantity">
                            <button class="subtract_btn">-</button><p class="quantity_input">1</p><button class="add_btn">+</button>
                        </div>
                        <button class="cartBtn">add to cart</button>
                    </div>
                </div>
            </div>
            `}).join('')
        }


//handle item quantity of products
const itemQuantity = () => {
        const addBtn = document.querySelectorAll('.add_btn')
        const subtractBtn = document.querySelectorAll('.subtract_btn')
            
            addBtn.forEach(btn => {
                let quantity;
                btn.addEventListener('click', () => {
                    quantity = Number(btn.previousElementSibling.textContent)
                    quantity++
                    btn.previousElementSibling.textContent = quantity
            })
            });
            subtractBtn.forEach(btn=> {
                let quantity;
                btn.addEventListener('click', () => {
                    quantity = Number(btn.nextElementSibling.textContent)
                    if (quantity > 1) {
                        quantity--
                    btn.nextElementSibling.textContent = quantity
                    }
                })
                
            })
            addToCart()
        }


//remove items in cart
const removeCartedItems = () => {
  removeAllBtn.parentElement.parentElement.children[1].innerHTML = ''
  
  fetch('https://audiophile-ecommerce-api-1zr9.onrender.com/cartdelete', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: user.id,
        })
      })
      .then(response => response.json())
      .then(data => {
      cartedProducts = data
      //renderCartedProducts()
      console.log(data)
      })
  removeTotals()
}
removeAllBtn.onclick = removeCartedItems

//add new item to cart
const addToCart = () => {
  const addToCartBtn = document.querySelectorAll('.cartBtn')
  addToCartBtn.forEach(btn => {
    let about = btn.parentElement.parentElement
    let name = about.querySelector('h2').querySelector('span').innerText
    let currentProduct = products.filter(p => p.name.toLowerCase() == name.toLowerCase())
    btn.addEventListener('click', () => {
    let itemCount = Number(btn.parentElement.querySelector('.item_quantity').querySelector('.quantity_input').innerText)
      fetch('https://audiophile-ecommerce-api-1zr9.onrender.com/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: user.id,
            product_id: currentProduct[0].id,
            quantity: itemCount
        })
      })
      .then(response => response.json())
      .then(data => {
      cartedProducts = data
      getSumOfCartItems(getCartedProducts(), 'quantity')
      renderCartedProducts()
      console.log(data)
      })
    })
  })
}

itemQuantity()


//get products carted in local storage
const getCartedProducts =  () => {
  return cartedProducts
}



//render carted products from db
const renderCartedProducts =  () => {
  let cart = getCartedProducts()
  const cartHolder = document.querySelectorAll('.carted_items')
  
  cartHolder.forEach(cartHolder => {
    cartHolder.innerHTML = cart.map(item => {
      return `<div class="carted">
                <img src="${item.image}" alt="carted_img">
                  <div class="carted_details">
                    <p>${item.name}</p>
                    <p>$<span>${item.price.toLocaleString()}</span></p>
                  </div>
                  <div class="item_quantity">
                    <p class="quantity_input">X${item.quantity}</p>
                  </div>
              </div>
      `
    }).join('')
  })
  
  cartCounter()
  
}
const getSumOfCartItems = (array, key) => {  
  
  return array.reduce((sum, item) => {
    return sum + (item[key] || 0);
  }, 0)
}

const cartCounter = () => {
  const cartCount = document.querySelectorAll('.cart_count')
  cartCount.forEach(counter => {
    counter.innerHTML = getSumOfCartItems(getCartedProducts(), 'quantity')
  })
  totalPrice()
}

const totalPrice = () => {
  const total = document.querySelectorAll('.total_cost')
  total.forEach(total => {
    total.innerHTML = getSumOfCartItems(getCartedProducts(), 'cost').toLocaleString()
  })
  getVATandGrandTotal()
} 
const getVATandGrandTotal = () => {
  if (formSubmitBtn){
  const grand = document.querySelector('.total_grand')
  const Vat = document.querySelector('.VAT')
  let total = getSumOfCartItems(getCartedProducts(), 'cost')
  const getVatIfNeeded = () => {if (total == 0) {return 0} else {return 50}}
  let VAT = Math.round(total * 0.2)
  let grandTotal = total + VAT + getVatIfNeeded()
  grand.innerHTML = Math.round(grandTotal).toLocaleString()
  Vat.innerHTML = VAT.toLocaleString()
  }

  
}
const orderComfirmation = () => {
  const comfirmationContainer = document.querySelector('.confirmation')
  let orders = getCartedProducts()
  let total = getSumOfCartItems(getCartedProducts(), 'cost')
  let VAT = Math.round(total * 0.2)
  let grandTotal = total + VAT + 50
  let firstOrder = getCartedProducts()[0]
  const comfirmGrandTotal = document.querySelector('.comfirmGrandTotal')
  const holder = document.querySelector('.item')
  const otherLeft = document.querySelector('#otherLeft')
  comfirmGrandTotal.innerHTML = grandTotal.toLocaleString()
  holder.innerHTML = `
      <div class="carted">
          <img src="${firstOrder.image}" alt="carted_img">
          <div class="carted_details">
            <p>${firstOrder.name}</p>
            <p>$<span>${firstOrder.price.toLocaleString()}</span></p>
          </div>
          <div class="item_quantity">
            <p class="quantity_input">X<span>${firstOrder.quantity}</span></p>
          </div>`
  otherLeft.innerHTML = orders.length - 1
  comfirmationContainer.classList.remove('hide')
}

//remove total on checkout
const removeTotals = () => {
  const cartCount = document.querySelectorAll('.cart_count')
  const total = document.querySelectorAll('.total_cost')
  cartCount.forEach(counter => {
    counter.innerHTML = ''
  })
  total.forEach(total => {
    total.innerHTML = 0
  })

  //get total summary
  if (formSubmitBtn) {
    const grand = document.querySelector('.total_grand')
    const Vat = document.querySelector('.VAT')
    const summaryCart = document.querySelector('.summary_cart')
    summaryCart.innerHTML = ''
    grand.innerHTML = 0
    Vat.innerHTML = 0
  }

}

//submit checkout form
if (formSubmitBtn) {
  formSubmitBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    orderComfirmation()
    removeCartedItems()
  })

}


//handle logout
const logout = () => {
    localStorage.removeItem('userId')
  
}


logoutBtn.onclick = logout
window.onload = getUserProfile

