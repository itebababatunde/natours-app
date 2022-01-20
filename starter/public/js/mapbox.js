const locations = JSON.parse(document.getElementById('map').dataset.locations)


mapboxgl.accessToken = 'pk.eyJ1IjoiaXRlb2x1d2FraXNoaSIsImEiOiJja3N1MzY5anoxYzVjMnVtZGwxbThjemdsIn0.YMswUlvGHDFcGwA8-o5uxw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/iteoluwakishi/cksu3stq84sb518mrzoyfjgmu',
    scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc=>{
    //create marker
    const el = document.createElement('div')
    el.className = 'marker'

    //add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map)

    //add popup
    new mapboxgl.Popup({offset:30}).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`).addTo(map)

    //extend bounds to include current location
    bounds.extend(loc.coordinates)

map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left:100,
      right:100
    }
  })
})