console.log('Script.js on käynnistynyt');

document.getElementById('searchBtn').addEventListener('click', haeSaa);
document.getElementById('cityInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    haeSaa();
  }
});

async function haeSaa() {
  const kaupunki = document.getElementById('cityInput').value;
  console.log(`Haetaan säätiedot kaupungille: ${kaupunki}`);

  try {
    const response = await fetch(`/forecast?city=${kaupunki}`);
    const data = await response.json();

    console.log(data); // Tarkistetaan että data tulee

    // Nykyinen sää. Yksi rivi poistettu template literalilla mahdollista myöhempää käyttöä varten
    const nykyinen = `
      <h2>${data.city.name}</h2>
      <p>Lämpötila nyt: ${Math.round(data.list[0].main.temp)} °C</p>
      <p>Tuntuu kuin: ${Math.round(data.list[0].main.feels_like)} °C</p>
     ${'' /* <p>Kuvaus: ${data.list[0].weather[0].description}</p> */ }
      <p>Tuulen nopeus: ${data.list[0].wind.speed} m/s</p>
      <img class="icon-chip" src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png">
    `;

    // Viikonpäivien lyhenteet
    const viikonpaivat = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];

    let ennusteHTML = `<h3>Ennuste:</h3><div class="forecast">`;
    const paivitetyt = [];

    data.list.forEach(item => {
      const aika = item.dt_txt;
      if (aika.includes("12:00:00")) {
        const pvm = new Date(aika);
        const viikonpaiva = viikonpaivat[pvm.getDay()];
        const pvmStr = aika.split(" ")[0];

        if (!paivitetyt.includes(pvmStr)) {
          ennusteHTML += `
            <div class="forecast-item">
              <small>${viikonpaiva}</small>
              <img class="icon-chip" src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="ikoni">
              <p>${Math.round(item.main.temp)}°C</p>
            </div>
          `;
          paivitetyt.push(pvmStr);
        }
      }
    });

    ennusteHTML += `</div>`;

    const weatherCard = document.getElementById('weatherResult');
weatherCard.innerHTML = nykyinen + ennusteHTML;

// Käynnistetään fade-in uudelleen
weatherCard.style.animation = 'none';
void weatherCard.offsetWidth; // pakotettu reflow (nollaa animaation)
weatherCard.style.animation = 'fadeInCard 0.8s ease-in-out forwards';


  } catch (error) {
    console.error('Virhe haettaessa säätietoja:', error);
    document.getElementById('weatherResult').innerText = 'Virhe säätiedon haussa.';
  }
}
