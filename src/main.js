async function asyncRequest(url, options = {}) {
  try {
    const response = await fetch(url, options)
    const json = await response.json()
    return json
  } catch(err) {
    console.log(err.message)
  }
}

function handleData(data) {
  const { list } = data
  let before = undefined;
  let listPerDate = []
  let newarr = []
  let num = 0

  const weatherDay = list.map((item) => {
    return {
      dt: item.dt,
      dt_txt: item.dt_txt,
      temp: item.main.temp,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      wind_speed: item.wind.speed, 
      pop: item.pop,
      description: item.weather[0].description
    }
  })

  for(item of weatherDay) {
    if(num === 7) {
      newarr.push(item)
      listPerDate.push(newarr)
      newarr = []
      num = 0 
      continue
    } 
    num++
    newarr.push(item)
  }

  const ListFiltered = weatherDay.filter(item => {
    return (item.dt_txt.indexOf('12:00:00') !== -1) && item.description
  })

  const temperature = handleMinMaxTemperature(listPerDate)

  return {ListFiltered, temperature}
}

function handleMinMaxTemperature(data) {
  let min = []
  let max = []
  const tempMax = data.map((item) => 
    item.map((subItem) => subItem.temp_max)
  )

  for (let i = 0; i < tempMax.length; i++) {
    max.push(Math.max(...tempMax[i]))
  }

  const tempMin = data.map((item) => 
    item.map((subItem) => subItem.temp_min)
  )

  for (let i = 0; i < tempMin.length; i++) {
    min.push(Math.min(...tempMin[i]))
  }

  return {min, max}
}

(async () => {
  const apiKey = '5eed8bb742263f3bdf3311738402d4f1' //appid
  const city = 'Ribeirão+Preto,BR' //q
  const lang = 'pt' //lang
  const units = 'metric' //units
  const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?'
  const url = `${baseUrl}q=${city}&lang=${lang}&units=${units}&appid=${apiKey}`

  const response = await asyncRequest(url)
  const data = handleData(response)
  console.log(data)
  const date = new Date()
  const weekday = date.toLocaleDateString('pt-BR', {weekday: 'long'})
  console.log(weekday)
})()
