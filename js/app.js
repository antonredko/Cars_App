let CARS = [...DATA]
const carListEl = document.getElementById('carList')
const masonryBtnsEl = document.getElementById('masonryBtns')
const sortingSelectEl = document.getElementById('sortingSelect')
const showBtnsEl = document.getElementById('showBtns')
const showMoreBtnEl = document.getElementById('showMoreBtn')
const showAllBtnEl = document.getElementById('showAllBtn')
const searchFormEl = document.getElementById('searchForm')
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
const exchangeCourseUSD = 28.35194


searchFormEl.addEventListener('submit', function(event) {
  event.preventDefault()

  let query = this.search.value.toLowerCase().trim().split(' ')
  const searchFields = ['make', 'model', 'year']

  CARS = DATA.filter(car => {
    return query.every(word => {
      return searchFields.some(field => {
        return `${car[field]}`.toLowerCase().trim().includes(word)
      })
    })
  })

  if (CARS.length) {
    renderCards(carListEl, CARS, false, true)
    this.search.blur()
  } else {
    masonryBtnsEl.querySelectorAll('.btn').forEach(btn => {
      btn.setAttribute('disabled', '')
    })

    // carListEl.innerHTML = `<div class='text-center py-4'>
    //     <p>хуй</p>
    //   </div>`
  }
  
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


showMoreBtnEl.addEventListener('click', function() {
  renderCards(carListEl, CARS, true)
})


showAllBtnEl.addEventListener('click', function() {
  renderCards(carListEl, CARS, true, true)
})


renderCards(carListEl, CARS, true)


function renderCards(where, array, add, all) {
  let countOfCards = all ? array.length : 10
  let children = 0

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
      where.insertAdjacentHTML('beforeEnd', Card(element))
    } else {
      break
    }
  }

  if (where.children.length === array.length) {
    showMoreBtnEl.classList.add('d-none')
    showAllBtnEl.classList.add('d-none')
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

  return `<div class="card mb-3 p-0">
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
                <h2 class="card-title fs-3 fw-bold mb-3">${data.make} ${data.model} ${data.engine_volume ? data.engine_volume : ''} ${data.transmission ? data.transmission : ''} (${data.year})</h2>
                <h3 class="card-price fs-3 d-flex align-items-center fw-bold mb-4">${usdFormatter.format(data.price)} <span class="text-muted fs-5 fw-normal ms-4">${uahFormatter.format(priceUAH)}</span></h3>
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
                <div class="d-flex align-items-center">
                  <a href="tel:${data.phone}" class="btn btn-primary fw-bold call-btn">
                    <i class="fas fa-phone-alt me-2"></i> Позвонить
                  </a>
                  <p class="ms-3 text-muted">${data.seller}</p>
                </div>
              </div>
            </div>
            <div class="card-footer text-muted d-flex">
              <small>
                <i class="far fa-clock me-1"></i>
                <span>${timeFormatter.format(data.timestamp)} ${dateFormatter.format(data.timestamp)}</span>
              </small>
              <small class="ms-3">
                <i class="fas fa-eye me-1"></i>
                <span>${data.views}</span>
              </small>
            </div>
          </div>`
}


// Utils

function findSiblings(elem) {
  const children = Array.from(elem.parentElement.children)
  return children.filter(child => child != elem)
}