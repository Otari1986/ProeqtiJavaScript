let section = document.querySelector("section")
let userName = document.querySelector(".userName")
let userImage = document.querySelector(".userImage")
let basketList = document.getElementById("basketList")
let emptyBasket = document.getElementById("carieli")

emptyBasket.style.display = "none"

function fetchProfile() {
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
            if (!data.cartID) {
                emptyBasket.style.display = "block"
            }
            else {
                fetch("https://api.everrest.educata.dev/shop/cart", {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${Cookies.get("user")}`
                    }
                })
                    .then(pasuxi => pasuxi.json())
                    .then(data => {
                        if (data.products.length == 0) {
                            emptyBasket.style.display = "block"
                        }
                        else {
                            totalPrice.innerText = data.total.price.current
                            data.products.forEach((item, i) => {
                                fetch(`https://api.everrest.educata.dev/shop/products/id/${item.productId}`)
                                    .then(pasuxi => pasuxi.json())
                                    .then(product => {
                                        basketList.innerHTML += `<li>
                                            <div class="productImage box1"><img src="${product.thumbnail}" alt=""></div>
                                            <p class="box2">${product.title}</p>
                                            <div class="qty box3">
                                                <button onclick="minus('${item.productId}', ${item.quantity})"><i class="fa-solid fa-minus"></i></button>
                                                <p>${item.quantity}</p>
                                                <button onclick="plus('${item.productId}', ${item.quantity})"><i class="fa-solid fa-plus"></i></button>
                                            </div>
                                            <p class="box4">${product.price.currency} ${product.price.current}</p>
                                            <p class="box5"> Total:  ${data.products[i].quantity * product.price.current} </p>
                                            <button onclick="removeFromCart('${item.productId}')" class="delete box6"> Delete </button>
                                        </li>`
                                    })
                            })
                        }

                    })
            }
            userImage.innerHTML = `<img src="${data.avatar}" alt="">`
            userName.innerHTML = `<h1>${data.firstName} ${data.lastName}</h1>
            <span>Address: ${data.address}</span>
            <span>ZipCode: ${data.zipcode}</span>
            <span>Phone: ${data.phone}</span>
            <span>Email: ${data.email}</span>
            <span>Age: ${data.age}</span>
            <span>Gender: ${data.gender}</span>`
        })
}

fetchProfile()

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

let totalPrice = document.getElementById("totalPrice")

function minus(id, raodenoba) {
    raodenoba--
    let prodInfo = {
        "id": id,
        "quantity": raodenoba
    }
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
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
                    basketList.innerHTML = ""
                    fetchProfile()
                    checkBasketQty()
                })
        })
}

function plus(id, raodenoba) {
    raodenoba++
    let prodInfo = {
        "id": id,
        "quantity": raodenoba
    }
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
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
                    basketList.innerHTML = ""
                    fetchProfile()
                    checkBasketQty()
                })
        })
}

function removeFromCart(id) {
    let info = {
        "id": id
    }
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
            fetch("https://api.everrest.educata.dev/shop/cart/product", {
                method: "DELETE",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${Cookies.get("user")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            })
                .then(pasuxi => pasuxi.json())
                .then(data => {
                    window.location.reload()
                    fetchProfile()
                    checkBasketQty()
                })
        })
}

function clearCart() {
    fetch("https://api.everrest.educata.dev/auth", {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
            fetch("https://api.everrest.educata.dev/shop/cart", {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${Cookies.get("user")}`
                }
            })
                .then(pasuxi => pasuxi.json())
                .then(data => {
                    window.location.reload()
                    checkBasketQty()
                })
        })
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
    window.location.href = "index.html"
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

let nav = document.querySelector("nav")

window.addEventListener("scroll", function () {
    if (window.scrollY > 150) {
        nav.classList.add("scrolled")
    } else {
        nav.classList.remove("scrolled")
    }
})

function CheckOut() {
    fetch("https://api.everrest.educata.dev/shop/cart/checkout", {
        method: "POST",
        headers: {
            accept: "*/*",
            Authorization: `Bearer ${Cookies.get("user")}`
        }
    })
        .then(pasuxi => pasuxi.json())
        .then(data => {
            basketList.innerHTML = "Products purchased successfully"
            basketList.style.color = "blue"
            basketList.style.fontSize = "50px"
        })
}

fetch("https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38")
    .then(pasuxi => pasuxi.json())
    .then(data => {
    })

fetch("https://api.everrest.educata.dev/quote?page_index=1&page_size=50")
    .then(pasuxi => pasuxi.json())
    .then(data => {
    })

let navLeftBtns = document.querySelector(".navLeftBtns")
let navRightBtns = document.querySelector(".navRightBtns")

function showBar() {
    navLeftBtns.classList.toggle("view")
    navRightBtns.classList.toggle("view")
}