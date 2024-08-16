// Import necessary Firebase and Leaflet libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default view zoomed out
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to convert grid square to coordinates
function gridSquareToLatLng(gridSquare) {
    // Placeholder conversion; replace with your own conversion logic
    const latLngs = {
        'EN52AW': [52.0, -1.0] // Example coordinates
    };
    return latLngs[gridSquare] || [0, 0]; // Default to [0,0] if not found
}

// Function to add a spot to Firestore
async function addSpotToFirestore(gridSquare, frequency, duration, latitude, longitude) {
    try {
        await addDoc(collection(db, 'spots'), {
            gridSquare,
            frequency,
            duration,
            latitude,
            longitude,
            date: new Date()
        });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Function to update the map
function updateMap(lat, lng) {
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Lat: ${lat}<br>Lng: ${lng}`)
        .openPopup();
}

// Handle form submission
document.getElementById('spot-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const gridSquare = document.getElementById('grid-square').value.toUpperCase();
    const frequency = document.getElementById('frequency').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    const [lat, lng] = gridSquareToLatLng(gridSquare);

    if (!isNaN(lat) && !isNaN(lng)) {
        // Add spot to Firestore
        await addSpotToFirestore(gridSquare, frequency, duration, lat, lng);

        // Update the map
        updateMap(lat, lng);
    } else {
        console.error('Invalid coordinates for grid square:', gridSquare);
    }
});

// Display spots from Firestore on map
async function displaySpotsInGridSquare() {
    const spotsCollection = collection(db, 'spots');
    const querySnapshot = await getDocs(spotsCollection);

    querySnapshot.forEach((doc) => {
        const spot = doc.data();
        const { latitude, longitude, frequency, date } = spot;

        if (latitude !== undefined && longitude !== undefined) {
            L.marker([latitude, longitude])
                .bindPopup(`<b>Frequency:</b> ${frequency}<br><b>Date:</b> ${date.toDate()}`)
                .addTo(map);
        } else {
            console.error('Invalid spot data:', spot);
        }
    });
}

// Call displaySpotsInGridSquare to load initial spots
displaySpotsInGridSquare();
