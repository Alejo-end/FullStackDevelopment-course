import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'


const Weather = ({ weather }) => {
    if (weather.length === 0) {
        return (
            <div>
            </div>
        )
    }
    const temp = Math.round((weather.main.temp - 273.15) * 100) / 100 //convert from kelvin to celsius, then round to 2 decimals
    return (
        <div>
            <p>temperature {temp} Celsius</p>
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].main} />
            <p>Description: {weather.weather[0].main}</p>
            <p>Humidity: {weather.main.humidity} %</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
    )
}

const Language = ({ language }) => {
    return (
        <div>
            <p>
                {language}
            </p>
        </div>
    )
}

const Country = ({ country }) => {
    const [weather, setWeather] = useState([])
    const apikey = process.env.REACT_APP_WEATHER_API_KEY
    const apiReq = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${apikey}`
    const weatherTitle = `Weather in ${country.capital[0]}`

    useEffect(() => {
        axios.get(apiReq)
            .then(response => {
                setWeather(response.data)
            })
    }, [apiReq])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area}</p>
            <h2>languages</h2>
            {Object.values(country.languages).map((language) => <Language key={language} language={language} />)} {/*Object.values() returns an array of all the language values*/}
            {country.flag}
            <h2>{weatherTitle}</h2>
            <Weather weather={weather} />
        </div>
    )
}


export default Country