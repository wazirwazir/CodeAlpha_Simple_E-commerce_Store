const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const form = document.querySelector('form')
const error = document.querySelector('#error')



const login = () => {
    fetch('https://audiophile-ecommerce-api-1zr9.onrender.com/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.email == emailInput.value) {
            console.log(data.id)
            window.location.href = 'home.html'
            localStorage.setItem('userId', data.id)
        } else {
            console.log('unsuccessful')
            error.style.display = 'block'
        }
        
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    login()
    
})

