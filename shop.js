let section = document.querySelector("section")
let btns = document.getElementById("btn")
let brands = document.getElementById("brands")
let categoryBtn = document.getElementById("categoryBtn")
let currentPage = 1

let filters = {
    page_index: 1,
    page_size: 12,
    keywords: "",
    category_id: "",
    brand: "",
    price_min: "",
    price_max: "",
    rating: "",
    sort_by: "",
    sort_direction: ""
}

fetchProducts()
renderBrands()
renderCategories()

function fetchProducts() {
    section.innerHTML = ""
    let params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
        if (filters[key] !== "" && filters[key] !== null) {
            params.append(key, filters[key])
        }
    })
    let url = `https://api.everrest.educata.dev/shop/products/search?${params.toString()}`
    fetch(url)
        .then(pasuxi => pasuxi.json())
        .then(data => {
            section.innerHTML = ""
            if (data.products.length === 0) {
                section.innerHTML = `<h2 class="verMoidzebna" >პროდუქტები ვერ მოიძებნა</h2>`
                maxPage = 0
            } else {
                data.products.forEach(item => {
                    section.innerHTML += card(item)
                })
                maxPage = Math.ceil(data.total / data.limit)
            }
            renderButtons()
        })
}

function card(item) {
    let isOut = item.stock <= 0
    let undiscounted = item.price.discountPercentage == 0

    return `<div class="card" onclick="showCardDetails('${item._id}')">
                <div class="cardPic"><img src="${item.thumbnail}" alt=""></div>
                <h3>${item.title.slice(0, 18)}</h3>
                <div class="price">
                    <p class="new">${item.price.currency} ${item.price.current}</p>
                    <div class="old ${undiscounted ? 'undiscounted' : ""}">
                        <p>${item.price.beforeDiscount}</p>
                        <div class="line"></div>
                    </div>
                </div>
                <p class="cardRating">Rating: ${item.rating}</p>
                <span>${item.description.slice(0, 50)}</span>
                <div class="stock ${isOut ? 'out' : 'in'}"> ${isOut ? 'Out Of Stock' : item.stock}</div>
                <button onclick="event.stopPropagation(); addToCart('${item._id}', this)" class="addToCart ${isOut ? 'out' : 'in'}" ${isOut ? "disabled" : ""}>Add To Cart</button>
                <p class="addToCartSms">დამატებულია კალათაში</p>
            </div>`
}

function addToCart(id, btn) {
    if (!Cookies.get("user")) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია")
        return
    }
    let card = btn.closest(".card")
    let sms = card.querySelector(".addToCartSms")

    let prodInfo = {
        "id": id,
        "quantity": 1
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
                        prodInfo.quantity = erteulisRaodenoba + 1
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

function renderCategories() {
    categoryBtn.innerHTML = `
        <button onclick="selectCategory(1)" class="${filters.category_id == 1 ? "activeCategory" : ""}">Laptop</button>
        <button onclick="selectCategory(2)" class="${filters.category_id == 2 ? "activeCategory" : ""}">Phone</button>`
}

function selectCategory(categoryId) {
    filters.page_index = 1
    if (filters.category_id == categoryId) {
        filters.category_id = ""
    } else {
        filters.category_id = categoryId
    }
    fetchProducts()
    renderCategories()
}

function renderButtons() {
    btns.innerHTML = ""
    if (maxPage == 0) {
        btns.innerHTML = `
            <button disabled>Prev</button>
            <button disabled>Next</button>`
        return
    }
    btns.innerHTML += `<button onclick="prevPage()" ${filters.page_index == 1 ? "disabled" : ""}>Prev</button>`
    for (let i = 1; i <= maxPage; i++) {
        btns.innerHTML += `<button onclick="gadasvla(${i})" class="${filters.page_index == i ? "active" : ""}">${i}</button>`
    }
    btns.innerHTML += `<button onclick="nextPage()" ${filters.page_index == maxPage ? "disabled" : ""}>Next</button>`
}

function prevPage() {
    if (filters.page_index > 1) {
        filters.page_index--
        fetchProducts()
    }
}

function gadasvla(page) {
    filters.page_index = page
    fetchProducts()
}

function nextPage() {
    if (filters.page_index < maxPage) {
        filters.page_index++
        fetchProducts()
    }
}

function renderBrands() {
    brands.innerHTML = ""
    fetch("https://api.everrest.educata.dev/shop/products/brands")
        .then(pasuxi => pasuxi.json())
        .then(data => {
            brands.innerHTML += `<li class="${filters.brand == "" ? 'mimdinare' : ''}" onclick="filterBrands('')">All</li>`
            data.forEach(item => {
                brands.innerHTML += brandName(item)
            })
        })
}

function brandName(item) {
    return `<li class="${filters.brand == item ? "mimdinare" : ""}" onclick="filterBrands('${item}')">${item}</li>`
}

function resetAllFiltersAndForm() {
    filters = {
        page_index: 1,
        page_size: 12,
        keywords: "",
        category_id: "",
        brand: "",
        price_min: "",
        price_max: "",
        rating: "",
        sort_by: "",
        sort_direction: ""
    }

    let filterForm = document.getElementById("filterForm")

    if (filterForm) filterForm.reset()
    fetchProducts()
    renderBrands()
    renderCategories()
}

function filterBrands(brand) {
    if (brand === "") {
        resetAllFiltersAndForm()
    } else {
        filters.page_index = 1
        if (filters.brand == brand) {
            filters.brand = ""
        } else {
            filters.brand = brand
        }
        fetchProducts()
        renderBrands()
        renderCategories()
    }
}

function resetAllFilters() {
    filters.brand = ""
    filters.category_id = ""
    filters.page_index = 1
}

function resetAllFiltersAndForm() {
    filters = {
        page_index: 1,
        page_size: 12,
        keywords: "",
        category_id: "",
        brand: "",
        price_min: "",
        price_max: "",
        rating: "",
        sort_by: "",
        sort_direction: ""
    }

    let filterForm = document.getElementById("filterForm")

    if (filterForm) filterForm.reset()
    fetchProducts()
    renderBrands()
    renderCategories()
}

function filterBrands(brand) {
    if (brand === "") {
        resetAllFiltersAndForm()
    } else {
        filters.page_index = 1
        if (filters.brand == brand) {
            filters.brand = ""
        } else {
            filters.brand = brand
        }
        fetchProducts()
        renderBrands()
        renderCategories()
    }
}

function filterCards(e) {
    e.preventDefault()
    filters.page_index = 1
    filters.keywords = document.getElementById("keywords").value.trim()
    filters.price_min = document.getElementById("price_min").value.trim()
    filters.price_max = document.getElementById("price_max").value.trim()
    filters.rating = document.getElementById("rating").value.trim()
    filters.sort_by = document.getElementById("sort_by").value
    filters.sort_direction = document.getElementById("sort_direction").value
    fetchProducts()
}

function resetFilters() {
    filters = {
        keywords: "",
        price_min: "",
        price_max: "",
        rating: "",
        sort_by: "",
        sort_direction: ""
    }
    document.getElementById("filterForm").reset()
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
    window.location.href = `carddetails.html?id=${id}`
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