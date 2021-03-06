let DATA = []
let CARS = []
const carListEl = document.getElementById('carList')
const favoritsBtnEl = document.getElementById('favoritsBtn')
const favoritsCountEl = document.getElementById('favoritsCount')
const masonryBtnsEl = document.getElementById('masonryBtns')
const sortingSelectEl = document.getElementById('sortingSelect')
const showMoreBtnEl = document.getElementById('showMoreBtn')
const showAllBtnEl = document.getElementById('showAllBtn')
const showBlockBtnsEl = document.getElementById('showBlockBtns')
const searchFormEl = document.getElementById('searchForm')
const filterFormEl = document.getElementById('filterForm')
const filterCountEl = document.getElementById('filterCount')
const notFoundEl = document.getElementById('notFound')
const backToListBtnEl = document.getElementById('backToListBtn')
const dateFormatter = new Intl.DateTimeFormat()
const numberFormatter = new Intl.NumberFormat()
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit'
})
const usdFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})
const uahFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'UAH',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})
let exchangeCourseUSD = 0
let wishListLS = []
let shoppingCartLS = []
const searchFields = ['make', 'model', 'year']
const filterFields = ['make', 'fuel', 'transmission', "price"]
const shoppingCartBtnEl = document.getElementById('shoppingCartBtn')
const shoppingCartCountEl = document.getElementById('shoppingCartCount')
const shoppingCartBodyEl = document.getElementById('shoppingCartBody')
const shoppingCartTableEl = document.getElementById('shoppingCartTable')
const shoppingCartEmptyEl = document.getElementById('shoppingCartEmpty')
const shoppingCartFooterEl = document.getElementById('shoppingCartFooter')
const toPayUsdEl = document.getElementById('toPayUsd')
const toPayUahEl = document.getElementById('toPayUah')
let scrollTimer = null


if (!localStorage.wishList) {
  localStorage.wishList = JSON.stringify([])
} else {
  wishListLS = JSON.parse(localStorage.wishList)
  activateBtn(favoritsCountEl, favoritsBtnEl, wishListLS)
}


if (!localStorage.shoppingCart) {
  localStorage.shoppingCart = JSON.stringify([])
} else {
  shoppingCartLS = JSON.parse(localStorage.shoppingCart)
  activateBtn(shoppingCartCountEl, shoppingCartBtnEl, shoppingCartLS)
}


createLayout()


window.addEventListener('scroll', () => {

    clearTimeout(scrollTimer)

    scrollTimer = setTimeout(() => {
        const reviewedCars = [...carListEl.children].filter((el) => isVisible(el))
        
        reviewedCars.forEach(el => {
            CARS.find(item => {
                if (item.id == el.dataset.carid) {
                    el.querySelector('.reviewed').innerHTML = item.reviews + 1
                    el.classList.add('reviewed-car')
                }
            })
        })
    }, 250)
})


// shoppingCartBodyEl.addEventListener('change', event => {
//     const quantityEl = event.target.closest('.cart-value')
// })


shoppingCartBodyEl.addEventListener('click', event => {
  const closeBtnEl = event.target.closest('.btn-close')
  const cartItemEl = event.target.closest('.shop-cart-item')

  if (closeBtnEl && cartItemEl) {
      const cartItemId = cartItemEl.dataset.id
      
      shoppingCartLS = shoppingCartLS.filter(car => car.id != cartItemId)
      localStorage.shoppingCart = JSON.stringify(shoppingCartLS)

      renderShoppingCartElement(shoppingCartBodyEl, shoppingCartLS)
      activateBtn(shoppingCartCountEl, shoppingCartBtnEl, shoppingCartLS)
  }
})


shoppingCartBtnEl.addEventListener('click', () => {
  renderShoppingCartElement(shoppingCartBodyEl, shoppingCartLS)
})


filterFormEl.addEventListener('submit', function(event) {
  event.preventDefault()
  
  filterCars(this)
  renderCards(carListEl, CARS, false, true)
})


filterFormEl.addEventListener('input', function() {
  filterCars(this)
  filterCountEl.innerHTML = CARS.length
})


carListEl.addEventListener('click', event => {
  const favBtnEl = event.target.closest('.to-favorites')
  const shopCartBtnEl = event.target.closest('.to-shopping-cart')
  const cardEl = event.target.closest('.card')
  const carId = cardEl.dataset.carid

  if (favBtnEl && cardEl) {
    const carIndex = wishListLS.findIndex(id => id == carId)
      
    if (~carIndex) {
      wishListLS.splice(carIndex, 1)
    } else {
      wishListLS.push(carId)
    }
    localStorage.wishList = JSON.stringify(wishListLS)
    
    activateBtn(favoritsCountEl, favoritsBtnEl, wishListLS)

    favBtnEl.classList.toggle('btn-secondary')
    favBtnEl.classList.toggle('btn-warning')

    favBtnEl.blur()
  }
  if (shopCartBtnEl && cardEl) {
    shoppingCartLS.push(CARS.find(car => car.id == carId))
    
    localStorage.shoppingCart = JSON.stringify(shoppingCartLS)

    activateBtn(shoppingCartCountEl, shoppingCartBtnEl, shoppingCartLS)

    shopCartBtnEl.blur()
  }
})


searchFormEl.addEventListener('submit', function(event) {
  event.preventDefault()

  notFoundEl.classList.add("d-none");

  let query = this.search.value.toLowerCase().trim().split(' ')

  CARS = DATA.filter(car => {
    return query.every(word => {
      return searchFields.some(field => {
        return `${car[field]}`.toLowerCase().trim().includes(word)
      })
    })
  })

  if (CARS.length) {
    renderCards(carListEl, CARS, false, true)
  } else {
    carListEl.innerHTML = ''

    notFoundEl.classList.remove('d-none')
    showBlockBtnsEl.classList.add('d-none')
  }
  
  this.search.blur()
  this.reset()
})


backToListBtnEl.addEventListener('click', () => {
  renderCards(carListEl, DATA, true)

  notFoundEl.classList.add('d-none')

  showBlockBtnsEl.classList.remove('d-none')
})


masonryBtnsEl.addEventListener('click', event => {
  const btnEl = event.target.closest('.btn')

  if (btnEl) {
    const type = btnEl.dataset.masonry

    if (type == '1') {
      carListEl.classList.remove('row-cols-2')
      carListEl.classList.add('row-cols-1')

    } else if (type == '2') {
      carListEl.classList.remove('row-cols-1')
      carListEl.classList.add('row-cols-2')
    }

    btnEl.classList.remove('btn-secondary')
    btnEl.classList.add('btn-success')

    const [siblingEl] = findSiblings(btnEl)

    siblingEl.classList.remove('btn-success')
    siblingEl.classList.add('btn-secondary')
  }

  btnEl.blur()
})


sortingSelectEl.addEventListener('change', function () {
    let [key, type] = this.value.split('-')

    CARS.sort((a, b) => {
        if (type == 'inc') {
            return a[key] - b[key]
        } else if (type == 'dec') {
            return b[key] - a[key]
        }
    })

    if (key && type) {
        renderCards(carListEl, CARS)
    } else {
        renderCards(carListEl, DATA)
    }
})


showMoreBtnEl.addEventListener('click', () => {
    renderCards(carListEl, CARS, true)
})


showAllBtnEl.addEventListener('click', () => {
    renderCards(carListEl, CARS, true, true)
})


function renderShoppingCartElement(where, array) {
    if (array.length) {
        shoppingCartTableEl.classList.remove('d-none')
        shoppingCartFooterEl.classList.remove('d-none')
        shoppingCartEmptyEl.classList.add('d-none')

        where.innerHTML = ''

        let html = ''

        const uniq = [...new Set(array.map(JSON.stringify))].map(JSON.parse)

        uniq.forEach(element => {
            html += shoppingCartElement(array, element)
        })

        where.insertAdjacentHTML('beforeEnd', html)

        const toPayUSD = array.reduce((sum, curr) => sum + curr.price, 0)
        const toPayUAH = toPayUSD * exchangeCourseUSD

        toPayUsdEl.innerHTML = usdFormatter.format(toPayUSD)
        toPayUahEl.innerHTML = uahFormatter.format(toPayUAH) || '---'
    } else {
        shoppingCartTableEl.classList.add('d-none')
        shoppingCartFooterEl.classList.add('d-none')
        shoppingCartEmptyEl.classList.remove('d-none')
    }
}


function shoppingCartElement(array, data) {
    const priceUAH = data.price * exchangeCourseUSD
    const reapitingElem = array.filter(item => item.id == data.id)
    const priceTotalUSD = data.price * reapitingElem.length
    const priceTotalUAH = priceTotalUSD * exchangeCourseUSD

    return `<tr class="shop-cart-item" data-id="${data.id}">
                <th scope="row"></th>
                <td>${data.make} ${data.model} ${data.engine_volume ? data.engine_volume : ''} ${data.transmission ? data.transmission : ''} (${data.year})</td>
                <td>
                    <span>${usdFormatter.format(data.price)}</span>
                    <span class="text-muted cart-price-uah">/ ${priceUAH ? uahFormatter.format(priceUAH) : '---'}</span>
                </td>
                <td>
                    <div class="input-group justify-content-center">
                        <button class="btn btn-primary">-</button>
                        <input class="cart-value text-center border-1 border-primary w-25" type="number" name="count" min="0" step="1" value="${reapitingElem.length}">
                        <button class="btn btn-primary">+</button>
                    </div>
                </td>
                <td>
                    <span>${usdFormatter.format(priceTotalUSD)}</span>
                    <span class="text-muted cart-price-uah">/ ${priceTotalUAH ? uahFormatter.format(priceTotalUAH) : '---'}</span>
                </td>
                <td>
                    <button type="button" class="btn-close align-middle" aria-label="Close"></button>
                </td>
            </tr>`
}


function createFilterBlocks(where, cars) {
  let blocksHtml = ''

  filterFields.forEach(field => {
    blocksHtml += createFilterBlock(cars, field)
  })

  where.insertAdjacentHTML('afterBegin', blocksHtml)
}


function createFilterBlock(cars, field) {
  let inputsHtml = ''

  if (field == "price") {
    inputsHtml += createFilterRange(cars, field)
  } else {
    const uValues = [...new Set(cars.map(car => car[field]))].sort()

    uValues.forEach(value => {
      inputsHtml += createFilterCheckbox(value, field)
    })
  }

  return `<fieldset class="row mb-3 pt-2 rounded filter-block overflow-auto">
            <legend class="col-form-label col-sm-2 pt-0 fw-bold">
              ${field == "make" ? "Марка"
                : field == "fuel" ? "Топливо"
                : field == "transmission" ? 'Трансмиссия'
                : field == "price" ? 'Цена'
                : ''}
            </legend>
            ${inputsHtml}
          </fieldset>`;
}


function createFilterCheckbox(value, field) {
  return `<label class="form-check-label d-flex align-items-center mb-2">
            <input class="form-check-input mt-0 me-2" type="checkbox" name="${field}" value="${value}">
            <span>${value}</span>
          </label>`;
}


function createFilterRange(cars, field) {
  const prices = cars.map(car => car.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  return `<label class="form-check-label col-12 d-flex align-items-center mb-2">
            <input class="col-5" type="number" min="${minPrice}" max="${maxPrice - 1}" step="1" value="${minPrice}" name="${field}" placeholder="от" id="minPrice">
            <span class="col-2 align-items-center justify-content-center">-</span>
            <input class="col-5" type="number" min="${minPrice + 1}" max="${maxPrice}" step="1" value="${maxPrice}" name="${field}" placeholder="до" id="maxPrice">
          </label>`
}


function filterCars(form) {
  const filterOptions = {}

  filterFields.forEach(field => {
    if (field == "price") {
      const priceValues = [...form[field]].map((item, i) => {
        return i == 0 ? item.value || 0 
                : i == 1 ? item.value || Infinity
                : item.value
      })
      filterOptions[field] = priceValues
    } else {
      const checkedValues = [...form[field]].reduce((accu, curr) => {
        if (curr.checked) {
          return [...accu, curr.value];
        } else {
          return [...accu]
        }
      }, [])
      filterOptions[field] = checkedValues
    }
  })

  const filterValues = Object.values(filterOptions)
  
  CARS = DATA.filter(car => {
    return filterValues.every(values => {
      return !values.length ? true : values.some(value => {
        return filterFields.some(field => {
          if (field == "price") {
            return car[field] >= Math.min(...values) && car[field] <= Math.max(...values)
          }
          return (`${car[field]}`.includes(value))
        })
      })
    })
  })
}


function renderCards(where, array, add, all) {
  let countOfCards = all ? array.length : 10
  let children = 0
  let html = ''

  if (add) {
    children = where.children.length
  } else {
    children = 0
    countOfCards = all ? countOfCards : where.children.length || countOfCards
    where.innerHTML = ''
  }

  for (let i = children; i < children + countOfCards; i++) {
    const element = array[i]

    if (element) {
      html += Card(element)
    } else {
      break
    }
  }
  where.insertAdjacentHTML('beforeEnd', html)

  if (where.children.length === array.length) {
    showBlockBtnsEl.classList.add('d-none')
  }
}


function Card(data) {
  let stars = ''
  let priceUAH = data.price * exchangeCourseUSD

  for (let i = 0; i < 5; i++) {
    if (i < data.rating && data.rating < i + 1) {
      stars += '<i class="fas fa-star-half-alt"></i>'
    } else if (i < data.rating) {
      stars += '<i class="fas fa-star"></i>'
    } else {
      stars += '<i class="far fa-star"></i>'
    }
  }

  return `<div class="card mb-3 p-0" data-carid="${data.id}" data-shopcount="0">
            <div class="favorites position-absolute">
              <button class="btn ${wishListLS.includes(data.id) ? 'btn-warning' : 'btn-secondary'} border-0 rounded-3 fs-5 to-favorites"><i class="fas fa-star"></i></button>
            </div>
            <div class="row p-3 h-100">
              <div class="col-5">
                <div class="position-relative">
                  <div class="card-labels position-absolute start-0">
                    ${data.top ? `<div class="card-labels-top d-flex align-items-center">
                    <span>TOP</span></div>` : ''}
                    ${data.vip ? `<div class="card-labels-vip d-flex align-items-center"><span>VIP</span></div>` : ''}
                  </div>
                  <img width="1" height="1" loading="lazy" src="${data.img}" alt="${data.make} ${data.model} ${data.engine_volume ? data.engine_volume : ''} ${data.transmission ? data.transmission : ''} (${data.year})" class="card-img w-100" />
                </div>
                <div class="card-rating my-3 text-center">${stars}</div>
              </div>
              <div class="col-7">
                <h2 class="card-title fs-3 fw-bold mb-3 col-9">${data.make} ${data.model} ${data.engine_volume ? data.engine_volume : ''} ${data.transmission ? data.transmission : ''} (${data.year})</h2>
                <h3 class="card-price fs-3 d-flex align-items-center fw-bold mb-4">${usdFormatter.format(data.price)} <span class="text-muted fs-5 fw-normal ms-4">${priceUAH ? uahFormatter.format(priceUAH) : '---'}</span></h3>
                <ul class="card-base-info row mb-4">
                  <li class="col-6 mb-3">
                    <i class="fas fa-tachometer-alt me-1 text-center"></i> ${numberFormatter.format(data.odo)} км
                  </li>
                  <li class="col-6 mb-3">
                    <i class="fas fa-map-marker-alt me-1 text-center"></i>${data.country}
                  </li>
                  <li class="col-6">
                    <i class="fas fa-gas-pump me-1 text-center"></i> ${data.fuel}${data.engine_volume ? `, ${data.engine_volume} л` : ''}
                  </li>
                  <li class="col-6 d-flex">
                    <span class="me-1 card-transmition"></span> ${data.transmission}
                  </li>
                </ul>
                <div class="card-consume mb-4">
                  <h4 class="mb-3 fw-bolder">Расход топлива (л/100км)</h4>
                  <ul class="row">
                    <li class="col-4">
                      <i class="fas fa-city me-1"></i> ${data.consume?.city || "-"}
                    </li>
                    <li class="col-4">
                      <i class="fas fa-road me-1"></i> ${data.consume?.road || "-"}
                    </li>
                    <li class="col-4">
                      <i class="fas fa-exchange-alt me-1"></i> ${data.consume?.mixed || "-"}
                    </li>
                  </ul>
                </div>
                ${data.vin ? `<div class="card-vin mb-4 d-flex"><p class="border border-primary border-2 rounded"><span class="card-vin-label p-2">VIN</span><span class="p-2">${data.vin}</span></p></div>` : ""}
                ${data.color ? `<div class="card-paint d-flex align-items-center mb-4">Цвет: <span class="ms-2">${data.color}</span></div>` : ""}
                <div class="d-flex align-items-center ">
                  <button class="btn btn-info text-light border-0 rounded-3 fw-bold to-shopping-cart"><i class="fas fa-cart-plus me-2"></i>В корзину</button>
                  <a href="tel:${data.phone}" class="btn btn-primary fw-bold ms-3 border-0 call-btn">
                    <i class="fas fa-phone-alt me-2"></i> Позвонить
                  </a>
                  <p class="ms-3 text-muted">${data.seller}</p>
                </div>
              </div>
            </div>
            <div class="card-footer text-muted d-flex justify-content-between">
              <div>
                  <small>
                    <i class="far fa-clock me-1"></i>
                    <span>${timeFormatter.format(data.timestamp)} ${dateFormatter.format(data.timestamp)}</span>
                  </small>
                  <small class="ms-3">
                    <i class="fas fa-eye me-1"></i>
                    <span class="reviewed">${data.reviews}</span>
                  </small>
              </div>
            </div>
          </div>`
}


// Utils

function isVisible(elem) {

    const coords = elem.getBoundingClientRect();
    const windowHeight = document.documentElement.clientHeight;
    const topVisible = coords.top > 0 && coords.top < windowHeight;
    const bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;
  
    return topVisible && bottomVisible;
}


function activateBtn(count, button, array) {
  count.innerHTML = array.length || ''

  if (count.innerHTML) {
    button.classList.remove('text-secondary')
    button.classList.add('text-warning')
  } else {
    button.classList.remove('text-warning')
    button.classList.add('text-secondary')
  }
}


function findSiblings(elem) {
  const children = Array.from(elem.parentElement.children)
  return children.filter(child => child != elem)
}


async function getData() {
  try {
    const response = await fetch('/Cars_List/data/cars.json')
    const data = await response.json()
    DATA = [...data]
    CARS = [...data]

  } catch(error) {
    console.warn(error)
  }
}


async function getRate() {
  try {
    const response = await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    const data = await response.json()
    
    exchangeCourseUSD = data.find(item => item.ccy == 'USD').sale
  } catch(error) {
    console.warn(error)
  }
}


async function createLayout() {
  await getData()
  await getRate()

  renderCards(carListEl, CARS, true)
  createFilterBlocks(filterFormEl, CARS)
  filterCars(filterFormEl)
  filterCountEl.innerHTML = CARS.length
}