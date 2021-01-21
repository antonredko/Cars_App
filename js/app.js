const CARS = [...DATA]
const carListEl = document.getElementById('carList')
const dateFormatter = new Intl.DateTimeFormat('ua')
const timeFormatter = new Intl.DateTimeFormat('ua', {
    hour: '2-digit',
    minute: '2-digit'
})
const currencyFormatterUSD = new Intl.NumberFormat('ua', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
})
const currencyFormatterUAH = new Intl.NumberFormat('ua', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0
})
const exchangeCourseUSD = 28.35194

// {
//     "id": "89aed5b8c686ebd713a62873e4cd756abab7a106",
//     "make": "BMW",
//     "model": "M3",
//     "year": 2010,
//     "img": "http://dummyimage.com/153x232.jpg/cc0000/ffffff",
//     "color": "Goldenrod",
//     "vin": "1G6DW677550624991",
//     "country": "United States",
//     "rating": 1,
//     "price": 2269,
//     "views": 5,
//     "seller": "Ellery Girardin",
//     "vip": true,
//     "top": false,
//     "timestamp": "1601652988000",
//     "phone": "+1 (229) 999-8553",
//     "fuel": "Benzin",
//     "engine_volume": 1.4,
//     "transmission": "CVT",
//     "odo": 394036,
//     "consume": { "road": 4.8, "city": 12.3, "mixed": 8.4 }
// },

renderCards(carListEl, CARS)


function renderCards(where, array){
    array.forEach(element => {
        where.insertAdjacentHTML('beforeEnd', Card(element))
    });
}

function Card(data) {
    let stars = ''
    let priceUAH = Math.round(data.price * exchangeCourseUSD)

    for (let i = 0; i < 5; i++) {
        if (i < data.rating && data.rating < i + 1) {
            stars += '<i class="fas fa-star-half-alt"></i>'
        } else if (i < data.rating) {
            stars += '<i class="fas fa-star"></i>'
        } else {
            stars += '<i class="far fa-star"></i>'
        }
    }

    return `<div class="card mb-3">
              <div class="row p-3">
                <div class="col-4">
                  <div class="position-relative">
                    <div class="card-labels position-absolute start-0">
                      ${data.top ? `<div class="card-labels-top d-flex align-items-center"><span>TOP</span></div>` : ''}
                      ${data.vip ? `<div class="card-labels-vip d-flex align-items-center"><span>VIP</span></div>` : ''}
                    </div>
                    <img width="1" height="1" loading="lazy" src="${data.img}" alt="${data.make} ${data.model} ${data.engine_volume} ${data.transmission} (${data.year})" class="card-img" />
                  </div>
                  <div class="card-rating my-3 text-center">${stars}</div>
                </div>
                <div class="col-8">
                  <h2 class="card-title fs-3 fw-bold mb-3">${data.make} ${data.model} ${data.engine_volume} ${data.transmission} (${data.year})</h2>
                  <h3 class="card-price fs-3 d-flex align-items-center fw-bold mb-4">${currencyFormatterUSD.format(data.price)} <span class="text-muted fs-5 fw-normal ms-4">${currencyFormatterUAH.format(priceUAH)}</span></h3>
                  <ul class="card-base-info row mb-4">
                    <li class="col-6 mb-3">
                      <i class="fas fa-tachometer-alt me-1 text-center"></i> ${new Intl.NumberFormat().format(data.odo)} km
                    </li>
                    <li class="col-6 mb-3">
                      <i class="fas fa-map-marker-alt me-1 text-center"></i>${data.country}
                    </li>
                    <li class="col-6">
                      <i class="fas fa-gas-pump me-1 text-center"></i> ${data.fuel}, ${data.engine_volume}l
                    </li>
                    <li class="col-6 d-flex">
                      <span class="me-1 card-transmition"></span> ${data.transmission}
                    </li>
                  </ul>
                  <div class="card-consume mb-4">
                    <h4 class="mb-3 fw-bolder">Fuel consumption (l/100km)</h4>
                    <ul class="row">
                      <li class="col-4">
                        <i class="fas fa-city me-1"></i> ${data.consume.city}
                      </li>
                      <li class="col-4">
                        <i class="fas fa-road me-1"></i> ${data.consume.road}
                      </li>
                      <li class="col-4">
                        <i class="fas fa-exchange-alt me-1"></i> ${data.consume.mixed}
                      </li>
                    </ul>
                  </div>
                  <div class="card-vin mb-4 d-flex">
                    <p class="border border-primary border-2 rounded">
                      <span class="card-vin-label p-2">VIN</span>
                      <span class="p-2 ps-0">${data.vin}</span>
                    </p>
                  </div>
                  <div class="card-paint d-flex align-items-center mb-4">
                    Color: <span class="ms-2">${data.color}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <a href="tel:${data.phone}" class="btn btn-primary fw-bold">
                      <i class="fas fa-phone-alt me-2"></i> Call
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








