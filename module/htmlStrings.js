export default function html (data) {
  const htmlText ={
    weekDays: `
      <div class="week-card">
        <h5>${weather.day}</h5>
        <img src="./assets/images/animated/snowy-1.svg" alt="">
        <div class="min-max">
          <span class="max-temperature">${weather.temperature.max.toFixed(0)}&ordm</span>
          <span class="min-temperature">${weather.temperature.min.toFixed(0)}&ordm</span>
        </div>
      </div>      
    `,
    today: ``,
    tomorrow: ``,
    dayThree: ``,
    dayFour: ``,
    dayFive: ``,
  }  
  return htmlText
}
