const navBtn = document.querySelector('.hamburger')
const navBar = document.querySelector('#navBar')
const cartContainer = document.querySelector('.cartContainer')
const cartBtn = document.querySelector('.checkCart')
const eNumberInput = document.querySelector('#e-number')
const ePinInput = document.querySelector('#e-Pin')
const sectionName = document.querySelector('#section_name')
let productsContainer = document.querySelector('.items_sold')
let products;

fetch('./data.json')
.then(response => response.json())
.then(data => {
    console.log(data)
    products = data.filter(item => item.category == sectionName.innerText.toLocaleLowerCase())
    renderProducts(products)
    itemQuantity()
})
.catch(err => console.error(err))


const displayNav = () => {
    if (!cartContainer.classList.contains('hide')) {
        cartContainer.classList.toggle('hide')
    }
    navBar.classList.toggle('hide')
}

const displayCart = () => {
    
    if (!navBar.classList.contains('hide')) {
        navBar.classList.toggle('hide')
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
            
        }