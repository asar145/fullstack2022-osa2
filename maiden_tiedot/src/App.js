import { useState, useEffect } from 'react'
import axios from 'axios'


const Button = ({handleClick, text}) => (
  <>
    <button onClick={handleClick}>
      {text}
    </button>
  </>
)

const Filter = ({handleFilterChange, filter}) => {
  return (
    <form>
      <div>
        find countries <input value={filter} onChange={handleFilterChange}/>
      </div>
    </form>
  )
}

const Matches = ({matchesToShow, setNewFilter}) => {
  if (matchesToShow.length === 0) {
    return (
      <div>
        <p>No matches, specify another filter</p>
      </div>
    )
  } else if (matchesToShow.length < 11) {
    return (
      <div>
        {matchesToShow.map(country => 
          <p key={country.name.common}>
            {country.name.common} <Button handleClick={() => setNewFilter(country.name.common)} text="show"/>
          </p>
        )}
      </div>
    )
  } else {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }
}

const Country = ({country}) => {
  let languages = []
  for (const [key, value] of Object.entries(country.languages)) {
    languages.push(value)
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map(language => 
          <li key={language}>
            {language}
          </li>
        )}
      </ul>
      <img src={country.flags.png} alt=""></img>
    </div>
  )
}

const Weather = ({weatherData, capital}) => {
  if (!weatherData) {
    return (
      <div>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>temperature {(weatherData.main.temp - 273.15).toFixed(2).toString()} Celcius</p>
        <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt=""></img>
        <p>wind {(weatherData.wind.speed).toString()} m/s</p>
      </div>
    )
  }
  
}

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [filter, setNewFilter] = useState('')
  const [capital, setCapital] = useState('---')
  const [weatherData, setWeatherData] = useState(0)

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (capital !== '---') {
      axios
        .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
        .then(response => {
          setWeatherData(response.data)
        })
    }
  }, [capital])


  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const matchesToShow = (filter === '')
  ? countries
  : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (matchesToShow.length === 1) {
    if (matchesToShow[0].capital[0] !== capital) {
      setCapital(matchesToShow[0].capital[0])
    }

    return (
      <div>
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <Country country={matchesToShow[0]} />
      <Weather weatherData={weatherData} capital={capital} />
      </div>
    )

  } else {
    return (
      <div>
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <Matches matchesToShow={matchesToShow} setNewFilter={setNewFilter} />
      </div>
    )
  }
  
}


export default App