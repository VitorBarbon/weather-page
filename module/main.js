async function asyncRequest(url, options = {}) {
  try {
    const response = await fetch(url, options)
    const json = await response.json()
    return json
  } catch(err) {
    throw new Error('Unable to complete the operation')
  }
}

function handleClearData(data) {
  const { DailyForecasts } = data

  const clearData = DailyForecasts.map(weather => {
    const date = new Date(weather.Date)
    const weekday = date.toLocaleDateString('pt-BR', {weekday: 'long'})
    return {
      sun: { 
        set: weather.Sun.Set, 
        epochRise: weather.Sun.EpochRise,
        rise: weather.Sun.Rise,
        epochSet: weather.Sun.EpochSet
       },
      day: weekday,
      temperature: {
        min: weather.Temperature.Minimum.Value,
        max: weather.Temperature.Maximum.Value
      },
      dayDescription: {
        day: {
          desc: weather.Day.IconPhrase,
          HasPrecipitation: weather.Day.HasPrecipitation
        },
        night: {
          desc: weather.Night.IconPhrase,
          HasPrecipitation: weather.Night.HasPrecipitation
        }
      },
    }
  })

  return clearData
}

function handleStyleSunClock(date, data) {
  const { sun } = data[0]
  const timeSunRise = new Date(sun.rise)
  const timeSunSet = new Date(sun.set)
  const [ sunRise, sunSet ] = [ 
    timeSunRise.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
    timeSunSet.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
  ]

  document.querySelector('.sunrise').innerText = sunRise
  document.querySelector('.sunset').innerText = sunSet

  const now = date.getTime()
  const percentage = timeSunSet.getTime() - timeSunRise.getTime()// = 100%
  const percentageNow = (now - timeSunRise.getTime() <= percentage) ?
    (now - timeSunRise.getTime())
    :
    (NaN)

  let percentageClockRotate = 0
  if(percentageNow !== isNaN)  {
    percentageClockRotate = (percentageNow * (180/percentage))
  }

  return percentageClockRotate.toFixed(2)
}

function handleIconWeather(icon) {
  const numberIcon = Number(icon)
  let svgAnimationName = 'sunny'
  if(numberIcon <= 6 && numberIcon > 4) svgAnimationName = 'cloudyAndSunny'
  if(numberIcon <= 11 && numberIcon > 7 || numberIcon === 19) svgAnimationName = 'cloudy'
  if(numberIcon === 12 || numberIcon === 18) svgAnimationName = 'rain'
  if(numberIcon <= 14 && numberIcon > 12) svgAnimationName = 'rainAndSunny'
  if(numberIcon <= 17 && numberIcon > 14) svgAnimationName = 'thunderStorms'
  if(numberIcon <= 21 && numberIcon > 19) svgAnimationName = 'cloudyAndSunny2'
  if(numberIcon <= 29 && numberIcon > 21) svgAnimationName = 'snow'

  return svgAnimationName
}

function handleRenderData(dataWeek, dataCurrent, city) {
  const now = new Date()
  const currentWeather = document.querySelector('.adjacent-current')
  const currentTime = document.querySelector('.current-time')
  const sunClock = document.querySelector('.sun-time')
  const weekWeather = document.querySelector('#adjacent')

  const degRotate = handleStyleSunClock(now, dataWeek)
  sunClock.style.rotate = `${degRotate}deg`
  currentTime.innerText = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
  const seconds = now.toLocaleTimeString('pt-BR', {second: '2-digit'})
  setTimeout(() => {
    setInterval(() => {
    const currentDate = new Date()
    sunClock.style.rotate = `${handleStyleSunClock(now, dataWeek)}deg`
    currentTime.innerText = currentDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
      
    }, 60000);
  }, (60000 - seconds * 1000));
  

  //Renderiza dados do clima da semana
  dataWeek.map((weather) => {
    weekWeather.insertAdjacentHTML('beforebegin',`
      <div class="week-card">
      <h5>${weather.day}</h5>
      <img src="./assets/images/animated/snowy-1.svg" alt="">
      <div class="min-max">
      <span class="max-temperature">${weather.temperature.max.toFixed(0)}&ordm</span>
      <span class="min-temperature">${weather.temperature.min.toFixed(0)}&ordm</span>
      </div>
      </div>
      `)
    })
    
    const {Temperature, PrecipitationProbability, Wind, RelativeHumidity, WeatherIcon} = dataCurrent[0]
    const svgName = handleIconWeather(WeatherIcon)
    //Renderiza o clima atual
    currentWeather.insertAdjacentHTML('beforebegin',`
      <img src="./assets/images/animated/${svgName}.svg" width="300px" alt="Clima Atual" id="img-current-weather">
      <div class="locale">
        <i>
          <img src="./assets/images/location.png" alt="Localização">
        </i><span> ${city}</span>
      </div>
      <div class="temperature">
        <div class="current-temperature">
          <h2 class="current-temp">${Temperature.Value.toFixed(0)}<span>&ordmC</span></h2>
        </div>
        <div class="min-max">
          <span class="max-temperature">${Math.floor(dataWeek[0].temperature.max)}&ordm</span>
          <span class="min-temperature">${dataWeek[0].temperature.min.toFixed(0)}&ordm</span>
        </div>
      </div>
      <div class="container-cards">
        <div class="card wind">
          <i><img src="./assets/images/wind.png" width="32px" alt="Vento"></i>
          <div>
            <h5>Vento</h5>
            <span>${Math.floor(Wind.Speed.Value)}</span> km/h
          </div>
        </div>
        <div class="card humidity">
          <i><img src="./assets/images/water.png" width="32px" alt="Umidade"></i>
          <div>
            <h5>Umidade</h5>
            <span>${RelativeHumidity}</span> %
          </div>
        </div>
        <div class="card rain">
          <i><img src="./assets/images/rainy.png" width="32px" alt="Chuva"></i>
          <div>
            <h5>Chuva</h5>
            <span>${PrecipitationProbability}</span> %
          </div>
        </div>
      </div>
    `)
}

function BrowserGeolocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const { latitude, longitude } = position.coords
        resolve({lat: latitude, lon: longitude});
      }, (error) => {
        reject(error.message);
      });
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  })
}

(async () => {
  const apiKey = 's8pCuNPJ9hC6iGeMmZZg6BzinBytIYyF'
  const lang = 'pt-br'
  const baseUrl = `http://dataservice.accuweather.com/`
  try {
    const location = await BrowserGeolocation()
    const localizationUrl = `${baseUrl}locations/v1/cities/search?apikey=${apiKey}&q=${location.lat}%2C${location.lon}&language=${lang}&details=false&offset=25`
    const locationKey = await asyncRequest(localizationUrl)
   
    const weekWeatherUrl = `${baseUrl}forecasts/v1/daily/5day/${locationKey[0].Key}?apikey=${apiKey}&language=${lang}&details=true&metric=true`
    const currentWeatherUrl = `${baseUrl}forecasts/v1/hourly/1hour/${locationKey[0].Key}?apikey=${apiKey}&language=${lang}&details=true&metric=true`
    const [ responseWeek, responseCurrent ] = await Promise.all([
        await asyncRequest(weekWeatherUrl),
        await asyncRequest(currentWeatherUrl)
      ])
      const dataWeek = handleClearData(responseWeek)
      handleRenderData(dataWeek, responseCurrent, locationKey[0].ParentCity.LocalizedName)
    } catch(err) {
      console.log(err.message)
    }
})()
