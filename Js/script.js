const navBtn = document.querySelector('.hamburger')
const navBar = document.querySelector('#navBar')
const cartContainer = document.querySelector('.cartContainer')
const cartBtn = document.querySelector('.checkCart')

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
