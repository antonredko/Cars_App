const CARS = [...DATA]
const carListEl = document.getElementById('carList')
const dateFormatter = new Intl.DateTimeFormat('en-US')
const timeFormatter = new Intl.DateTimeFormat('en-US',{
    hour: '2-digit',
    minute: '2-digit'
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
//   },

renderCards(carListEl, CARS)


function renderCards(where, array) {
    array.forEach(element => {
        where.insertAdjacentHTML('beforeEnd', Card(element))
    });
}

function Card(data) {
    let stars = ''

    for (let i = 0; i < 5; i++) {
        if (i < data.rating) {
            stars += '&#9733;'
        } else{
            stars += '&#9734;'
        }
    }

    return `<div class="card mb-2">
    <div class="row">
      <div class="col-4">
        <img width="1" height="1" loading="lazy" src="${data.img}" alt="${data.make} ${data.model}" class="card-img" />
      </div>
      <div class="col-8 card-body">
        <h2 class="card-title">${data.make} ${data.model} ${data.engine_volume} ${data.transmission} (${data.year})</h2>
        <h3 class="card-price">${data.price}</h3>
        <div class="card-rating">${stars} ${data.rating}</div>
        ${data.vin ? `<div class="card-vin">${data.vin}</div>` : ''}
        <a href="tel:${data.phone}" class="btn btn-success">Call</a>
        <small class="text-muted">${timeFormatter.format(data.timestamp)} ${dateFormatter.format(data.timestamp)}</small>
      </div>
    </div>
  </div>`
}








