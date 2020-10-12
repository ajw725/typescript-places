import axios from 'axios';

const API_KEY = '[REDACTED]';
const axiosClient = axios.create({ baseURL: 'https://maps.googleapis.com' });

const form = document.getElementById('search-form')! as HTMLFormElement;
const searchInput = document.getElementById(
  'search-input'
)! as HTMLInputElement;

type GeocodingResult = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

type GeocodingResponse = {
  results: GeocodingResult[];
  status: 'OK' | 'ZERO_RESULTS';
};

function searchHandler(event: Event) {
  event.preventDefault();

  const searchTerm = searchInput.value;
  const encoded = encodeURIComponent(searchTerm);
  axiosClient
    .get<GeocodingResponse>(
      `/maps/api/geocode/json?address=${encoded}&key=${API_KEY}`
    )
    .then((resp) => {
      // resp.data.results = [place]
      // place.geometry.location = { latitude:, longitude: }
      if (resp.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }
      const coords = resp.data.results[0].geometry.location;
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: coords,
          zoom: 8,
        }
      );
      var marker = new google.maps.Marker({ position: coords, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.error(err);
    });
}

form?.addEventListener('submit', searchHandler);
