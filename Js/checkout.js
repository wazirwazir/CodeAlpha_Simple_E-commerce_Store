const emoneyDetails = document.querySelector('.eMoney')
const cashDetails = document.querySelector('.cash_on_delivery_info')
const codInput = document.querySelector('#COD')
const emoneyInput = document.querySelector('#e-money')
const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"]')
const submitBtn = document.querySelector('#submit')

const hideInfo = () => {
    if(codInput.checked) {
        emoneyDetails.classList.add('hide')
        cashDetails.classList.remove('hide')
        
    } else if (!codInput.checked) {
        emoneyDetails.classList.remove('hide')
        cashDetails.classList.add('hide')
        
    }
}


codInput.onclick = hideInfo
emoneyInput.onclick = hideInfo


const handleEmoneyError = (input, number) => {
    if (input.value.length !== number) {
        input.classList.add('inputError')
        input.previousElementSibling.children[1].classList.remove('hide')
    } else {
        input.classList.remove('inputError')
        input.previousElementSibling.children[1].classList.add('hide')
    }
}

submitBtn.addEventListener('click', ()=> {
    
    allInputs.forEach(input => {
        if(input.value.length < 1) {
            input.classList.add('inputError')
            input.previousElementSibling.children[1].classList.remove('hide')
        } else {
            input.classList.remove('inputError')
            input.previousElementSibling.children[1].classList.add('hide')
        }
    });
    
    handleEmoneyError(eNumberInput, 9)
    handleEmoneyError(ePinInput, 4)
})
