const map = L.map('map').setView([-7.79, 110.37], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markerGroup = L.layerGroup().addTo(map);
const typeFilter = document.getElementById('typeFilter');
const kategoriSet = new Set();
let allFeatures = [];

// Ikon custom per kategori
const icons = {
  "Cafe": L.icon({ iconUrl: 'img/iconcafe.png', iconSize: [28, 28] }),
  "Museum": L.icon({ iconUrl: 'img/iconmus.png', iconSize: [28, 28] }),
  "Perpustakaan": L.icon({ iconUrl: 'img/iconpus.png', iconSize: [28, 28] }),
  "Taman": L.icon({ iconUrl: 'img/icontam.png', iconSize: [28, 28] }),
};

function updateMarkers() {
  markerGroup.clearLayers();
  const selected = typeFilter.value;

  allFeatures.forEach(feature => {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;
    const kategori = props.JenisTitik;

    if (selected === 'all' || selected === kategori) {
      const icon = icons[kategori] || icons.Default;
      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`<b>${props.name}</b><br>Kategori: ${kategori}`);
      markerGroup.addLayer(marker);
    }
  });
}

fetch("data/places.json")
  .then(res => res.json())
  .then(data => {
    allFeatures = data.features;

    // Ambil semua kategori unik dan isi filter
    data.features.forEach(f => kategoriSet.add(f.properties.JenisTitik));
    [...kategoriSet].forEach(k => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      typeFilter.appendChild(opt);
    });

    updateMarkers();
  });

fetch("data/jalan.json")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "#ff6b81",
        weight: 2
      }
    }).addTo(map);
  });


typeFilter.addEventListener("change", updateMarkers);
