let bigImage = document.getElementById("bigImage")
let smallDiv = document.getElementById("smallDiv")
let cardDetailsCenter = document.querySelector(".cardDetailsCenter")
let cardDetailsRight = document.querySelector(".cardDetailsRight")
let id = window.location.search.split("=")[1]

fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
    .then(pasuxi => pasuxi.json())
    .then(data => {
        smallDiv.innerHTML = ""
        bigImage.src = data.images[0]
        data.images.forEach((item, i) => smallDiv.innerHTML += `<div class="productSmallImages ${i === 0 ? 'activeImage' : ''}">
                <img onclick="changeImage('${item}', ${i})" src="${item}" alt="">
            </div>`)
        let isOut = data.stock <= 0
        cardDetailsCenter.innerHTML = `<h1>${data.title}</h1>
            <p>Rating: ${data.rating}</p>
            <p>Amount of Review: ${data.ratings.length}</p>
            <p class="stock ${isOut ? 'out' : 'in'}"> ${isOut ? 'Out Of Stock' : `Stock: ${data.stock}`}</p>
            <p>Category: ${data.category.name}</p>
            <p>Brand: ${data.brand}</p>
            <p>Issue Date: ${data.issueDate.slice(0, 10)}</p>
            <hr>
            <p>Details:</p>
            <p>${data.description}</p>`
        cardDetailsRight.innerHTML = `<h1>${data.price.currency} ${data.price.current}</h1>
            <div class="qty">
                <button onclick="minus()">-</button>
                <p id="quantity">1</p>
                <button onclick="plus()">+</button>
            </div>
            <div class="rightBottom">
                <button onclick="addToCart('${data._id}')" class="addToCart ${isOut ? 'out' : 'in'}" ${isOut ? "disabled" : ""}>Add To Cart</button>
                <p>Worldwide Shipping</p>
                <p>Secure Payment</p>
                <p>3 Years Full Warranty</p>
                <p class="addToCartSms">დამატებულია კალათაში</p>
            </div>`
    })

let shesayvaniRaodenoba = 1

function minus() {
    let quantity = document.getElementById("quantity")
    if (shesayvaniRaodenoba > 1) {
        shesayvaniRaodenoba--
        quantity.innerHTML = shesayvaniRaodenoba;
    }
}

function plus() {
    let quantity = document.getElementById("quantity")
    shesayvaniRaodenoba++
    quantity.innerHTML = shesayvaniRaodenoba
}

function addToCart(id) {
    if (!Cookies.get("user")) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია")
        return
    }
    let sms = document.querySelector(".addToCartSms")
    let prodInfo = {
        "id": id,
        "quantity": shesayvaniRaodenoba
    }
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            acceptaccept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
            if (data.cartID) {
                fetch("https://api.everrest.educata.dev/shop/cart", {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${Cookies.get("user")}`
                    }
                })
                    .then(pasuxi => pasuxi.json())
                    .then(data => {
                        let erteulisRaodenoba = 0
                        data.products.forEach(item => {
                            if (item.productId == id) {
                                erteulisRaodenoba = item.quantity
                            }
                        })
                        prodInfo.quantity = erteulisRaodenoba + shesayvaniRaodenoba
                        fetch("https://api.everrest.educata.dev/shop/cart/product", {
                            method: "PATCH",
                            headers: {
                                accept: "application/json",
                                Authorization: `Bearer ${Cookies.get("user")}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(prodInfo)

                        })
                            .then(pasuxi => pasuxi.json())
                            .then(data => {
                                sms.style.display = "block"
                                setTimeout(() => {
                                    sms.style.display = "none"
                                }, 1500)
                                checkBasketQty()
                            })
                    })
            }
            else {
                fetch("https://api.everrest.educata.dev/shop/cart/product", {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${Cookies.get("user")}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(prodInfo)
                })
                    .then(pasuxi => pasuxi.json())
                    .then(data => {
                        sms.style.display = "block"
                        setTimeout(() => {
                            sms.style.display = "none"
                        }, 1500)
                        checkBasketQty()
                    })
            }
        })
}

function changeImage(item, i) {
    bigImage.src = item
    let productSmallImages = document.querySelectorAll(".productSmallImages")
    productSmallImages.forEach(picture => {
        picture.classList.remove("activeImage")
    })
    productSmallImages[i].classList.add("activeImage")
}

function home() {
    window.location.href = "index.html"
}

function shop() {
    window.location.href = "shop.html"
}

let allAreaForm = document.getElementById("allAreaForm")
function showForm() {
    allAreaForm.classList.remove("hiddenForm")
    allAreaForm.classList.add("viewForm")
}

function closeForm() {
    allAreaForm.classList.remove("viewForm")
    allAreaForm.classList.add("hiddenForm")
}

function showCardDetails(id) {
    sessionStorage.setItem("id", `${id}`)
    window.location.href = "carddetails.html"
}

function goToProfile() {
    if (Cookies.get("user")) {
        window.location.href = "profile.html"
    } else {
        alert("გთხოვთ გაიაროთ ავტორიზაცია")
    }
}

let registerSms = document.getElementById("registerSms")

function register(e) {
    e.preventDefault()
    let formInfo = new FormData(e.target)
    let finalForm = Object.fromEntries(formInfo)
    fetch("https://api.everrest.educata.dev/auth/sign_up", {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(finalForm)
    })
        .then((pasuxi) => pasuxi.json())
        .then((data) => {
            if (data.error) {
                registerSms.innerHTML = data.errorKeys
                registerSms.style.color = "red"
            }
            else {
                registerSms.innerHTML = "რეგისტრაცია წარმატებულია"
                registerSms.style.color = "green"
                setTimeout(() => {
                    closeForm()
                }, 1000)
            }
        })
}

let allAreaSigninForm = document.getElementById("allAreaSigninForm")
function showSigninForm() {
    allAreaSigninForm.classList.remove("hiddenSigninForm")
    allAreaSigninForm.classList.add("viewSigninForm")
}

function closeSigninForm() {
    allAreaSigninForm.classList.remove("viewSigninForm")
    allAreaSigninForm.classList.add("hiddenSigninForm")
}

let loginSms = document.getElementById("loginSms")
let basketQty = document.querySelector(".basketQty")

function checkBasketQty() {
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
            if (data.cartID) {
                fetch("https://api.everrest.educata.dev/shop/cart", {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${Cookies.get("user")}`
                    }
                })
                    .then(pasuxi => pasuxi.json())
                    .then(data => {
                        if (data.total.quantity > 0) {
                            basketQty.innerHTML = data.total.quantity
                        }
                    })
            }
        })
}

checkBasketQty()

function login(e) {
    e.preventDefault()
    let formInfo = new FormData(e.target)
    let finalForm = Object.fromEntries(formInfo)
    fetch("https://api.everrest.educata.dev/auth/sign_in", {
        method: "POST",
        headers: {
            accept: "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(finalForm)
    })
        .then(pasuxi => pasuxi.json())
        .then((data) => {
            if (data.access_token) {
                Cookies.set("user", data.access_token)
                checkAuthState()
                loginSms.innerHTML = "ავტორიზაცია წარმატებულია"
                loginSms.style.color = "green"
                setTimeout(() => {
                    loginSms.style.display = "none"
                    closeSigninForm()
                }, 1000)
                checkBasketQty()
            } else {
                Cookies.remove("user")
                checkAuthState()
                loginSms.style.display = "block"
                loginSms.innerHTML = data.error
                loginSms.style.color = "red"
            }
        })
}

let authBtn = document.getElementById("authBtn")
let authRegister = document.getElementById("authRegister")

function checkAuthState() {
    if (Cookies.get("user")) {
        authBtn.textContent = "Sign Out"
        authRegister.textContent = "My Account"
    } else {
        authBtn.textContent = "Sign In"
        authRegister.textContent = "Register"
    }
}

checkAuthState()

function handleAuthButton(e) {
    if (Cookies.get("user")) {
        signOut()
    } else {
        showSigninForm()
    }
}

function handlauthRegister(e) {
    if (Cookies.get("user")) {
        window.location.href = "profile.html"
    } else {
        showForm()
    }
}

function signOut() {
    Cookies.remove("user")
    checkAuthState()
    window.location.reload()
}

let allInputs = document.querySelectorAll(".registerInp")
let formButton = document.getElementById("registerBtn")

let regexData = {
    firstName: /^[A-Z]?[a-z]{2,25}$/,
    lastName: /^[A-Z]?[a-z]{2,25}$/,
    email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    phone: /^\+[0-9]{12}$/,
    zipcode: /^.+$/,
    address: /^.+$/,
    age: /^[0-9]{1,3}$/,
    avatar: /^.+$/,
}

formButton.disabled = true

allInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
        let attrName = e.target.name
        if (regexData[attrName] && regexData[attrName].test(e.target.value)) {
            e.target.classList.add("valid")
            e.target.classList.remove("notvalid")
        } else if (regexData[attrName]) {
            e.target.classList.add("notvalid")
            e.target.classList.remove("valid")
        }
        checkForm()
    })

})

function checkForm() {
    let inputList = Array.from(allInputs)
        .filter(input => regexData[input.name])
    let isAllValid = inputList.every(input => input.classList.contains("valid"))
    formButton.disabled = !isAllValid
}

let navLeftBtns = document.querySelector(".navLeftBtns")
let navRightBtns = document.querySelector(".navRightBtns")

function showBar() {
    navLeftBtns.classList.toggle("view")
    navRightBtns.classList.toggle("view")
}