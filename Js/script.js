const saveCartedProducts = (data) => {
  localStorage.setItem('allProducts', JSON.stringify(data)) 
}
if (!localStorage.getItem('allProducts')) {
  saveCartedProducts([])
}

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



//load products from db
if (productsContainer) {
    fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        products = data.filter(item => item.category == sectionName.innerText.toLocaleLowerCase())
        renderProducts(products)
        renderCartedProducts()
        itemQuantity()
    })
    .catch(err => console.error(err))
}

const getUserProfile = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    window.location.href = 'index.html'
  }
  fetch(`http://localhost:3000/profile/${userId}`)
  .then(response => response.json())
  .then(data => console.log(data))
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
  removeCarted()
  saveCartedProducts([])
  
  removeTotals()
}
removeAllBtn.onclick = removeCartedItems

//add new item to cart
const addToCart = () => {
  const addToCartBtn = document.querySelectorAll('.cartBtn')
  addToCartBtn.forEach(btn => {
    let img = btn.parentElement.parentElement.previousElementSibling.children[0].src
    let about = btn.parentElement.parentElement
    let name = about.querySelector('h2').querySelector('span').innerText
    let price = Number(about.querySelector('.item_price').querySelector('#itemPrice').innerText.replace(/,/g, ""))
    
    btn.addEventListener('click', () => {
      let itemCount = Number(btn.parentElement.querySelector('.item_quantity').querySelector('.quantity_input').innerText)
      let itemAdd = {
        name: name,
        price: price,
        img: img,
        quantity: itemCount,
        cost: price * itemCount
      } 
      
      
      updateCartedProducts(itemAdd)
      getSumOfCartItems(getCartedProducts(), 'quantity')
      renderCartedProducts()
    })
  })
}

itemQuantity()


//get products carted in local storage
const getCartedProducts = () => {
  return JSON.parse(localStorage.getItem('allProducts')) || [];
}

//update
const updateCartedProducts = (product) => {
  let store = getCartedProducts();
  let existing = store.find(item => item.name == product.name)

  if (existing) {
    existing.quantity = product.quantity
    existing.cost = product.cost
  } else {
    store.push(product)
  }
  saveCartedProducts(store)
  getCartedProducts()
}

//remove
const removeCarted = () => {
  localStorage.removeItem('allProducts')
}


//render carted products from local storage
const renderCartedProducts = () => {
  let cart = getCartedProducts()
  const cartHolder = document.querySelectorAll('.carted_items')
  cartHolder.forEach(cartHolder => {
    cartHolder.innerHTML = cart.map(item => {
      return `<div class="carted">
                <img src="${item.img}" alt="carted_img">
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
  getUserProfile()
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
          <img src="${firstOrder.img}" alt="carted_img">
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
const removeTotals = () => {
  const cartCount = document.querySelectorAll('.cart_count')
  const total = document.querySelectorAll('.total_cost')
  cartCount.forEach(counter => {
    counter.innerHTML = ''
  })
  total.forEach(total => {
    total.innerHTML = 0
  })

  if (formSubmitBtn) {
    const grand = document.querySelector('.total_grand')
    const Vat = document.querySelector('.VAT')
    const summaryCart = document.querySelector('.summary_cart')
    summaryCart.innerHTML = ''
    grand.innerHTML = 0
    Vat.innerHTML = 0
  }

}

if (formSubmitBtn) {
  formSubmitBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    orderComfirmation()
    removeCartedItems()
  })
}

//handle logout
const logout = () => {
    console.log('hi')
    localStorage.removeItem('userId')
  
}
logoutBtn.onclick = logout

window.onload = renderCartedProducts
