const navBtn = document.querySelector('.hamburger')
const navBar = document.querySelector('#navBar')
const cartContainer = document.querySelector('.cartContainer')
const cartBtn = document.querySelector('.checkCart')
const eNumberInput = document.querySelector('#e-number')
const ePinInput = document.querySelector('#e-Pin')
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

fetch('./data.json')
.then(response => response.json())
.then(data => console.log(data))