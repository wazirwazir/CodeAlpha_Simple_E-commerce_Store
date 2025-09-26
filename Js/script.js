const saveCartedProducts = (data) => {
  localStorage.setItem('allProducts', JSON.stringify(data)) 
}
if (!localStorage.getItem('allProducts')) {
  saveCartedProducts([])
}

const navBtn = document.querySelector('.hamburger')
const navBar = document.querySelector('#navBar')
const cartContainer = document.querySelector('.cartContainer')
const cartBtn = document.querySelector('.checkCart')
const eNumberInput = document.querySelector('#e-number')
const ePinInput = document.querySelector('#e-Pin')
const sectionName = document.querySelector('#section_name')
let productsContainer = document.querySelector('.items_sold')
const removeAllBtn = document.querySelector('.removeBtn')
let products;
let cartedItems;

if (productsContainer) {
    fetch('./data.json')
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


const checkNewProduct = (e) => {if(e.new == true) {return 'new product'} else{return ''}}

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
const removeCartedItems = () => {
  removeAllBtn.parentElement.parentElement.children[1].innerHTML = ''
  removeCarted()
  saveCartedProducts([])
  const cartCount = document.querySelectorAll('.cart_count')
  cartCount.forEach(counter => {
    counter.innerHTML = ''
  })
}

removeAllBtn.onclick = removeCartedItems
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
      console.log(itemAdd)
      
      
      updateCartedProducts(itemAdd)
      cartedItems = getCartedProducts()
      getSumOfCartItems(getCartedProducts(), 'quantity')
      renderCartedProducts()
    })
  })
}

itemQuantity()

const getCartedProducts = () => {
  return JSON.parse(localStorage.getItem('allProducts')) || [];
}

/* const addCartedProducts = (item) => {
  let store = getCartedProducts()
  store.push(item);
  saveCartedProducts(store)
} */
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

const removeCarted = () => {
  localStorage.removeItem('allProducts')
}


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
}
window.onload = renderCartedProducts