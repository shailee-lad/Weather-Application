import React, {Component, useState, useEffect} from 'react'
import night from './wallpaper.webp'
import Clear from '../Images/clear.png'
import Clouds from '../Images/cloud.png'
import Drizzle from '../Images/drizzle.png'
import Humidity from '../Images/humidity.png'
import Rain from '../Images/rain.png'
import Snow from '../Images/snow.png'
import wind from '../Images/wind.png'
import searchBar from '../Images/search.png'
import day from '../Images/Day.jpeg'
import loading from '../Images/loading.svg'
import Fog from '../Images/Fog.svg'
import Moon from '../Images/Moon.svg'
import white from '../Images/White.jpeg'
import './SlideOne.css'

const today = new Date();
let api_key = "bc14969869c7adddf14614b8527dc219";
let isNight = false;
let url = '';
let response = null;
let data = null;


/**
 * 
 * @returns today's date
 */
function getDate()
{
    
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();

    return `${date}/${month}/${year}`;
}

/**
 * 
 * @returns current time
 */
function getCurrentTime()
{
    const currentMin = today.getMinutes();
    const currentHour = today.getHours();

    return `${currentHour}: ${currentMin}`
}

/**
 * 
 * @param  x : description of the current weather, i.e. is it either cloudy, snowy, ...
 * @returns image that is the best fit for this weather description.
 */
function getImage(x) 
{
    if(isNight === true)
    {
        isNight = false;
        return Moon;
    }
    if(x == 'Rain')
        return Rain; 

    else if(x == 'Clouds' || x == 'Mist')
        return Clouds;

    else if(x == 'Clear' || x == 'Sunny')
        return Clear;

    else if(x == 'Drizzle')
        return Drizzle;
    
    else if(x == 'Snow')
        return Snow;

    else 
        return Fog;
     
}

function getBackground(arr, time, x)
{
    if(time >= arr[0] && time <= arr[1])
    {
        isNight = false;
        return day;

    } else
    {
        isNight = true;
        return night;
            
    }

        
}


function SlideOne() 
{
    const[weatherDescription, setWeatherDescription] = useState(loading); 
    const[currentHumidity, setCurrentHumidity] = useState('...');
    const[currentWind, setCurrentWind] = useState('...');
    const[currentTemperature, setCurrentTemperature] = useState('...');
    const[currentDate, setCurrentDate] = useState(getDate());
    const[currentTime, setCurrentTime] = useState(getCurrentTime());
    const[mainWeatherDescription, setMainWeatherDescription] = useState(white);
    const[currentLongitude, setCurrentLongitude] = useState(0);
    const[currentLatitude, setCurrentLatitude] = useState(0);

    
    function getCoordinates()
    {
        navigator.geolocation.getCurrentPosition((position) =>
        {  
            getCurrentData(position.coords.longitude, position.coords.latitude);
        
        });

    }

    async function getCurrentData(long, lat)
    {
       
        try
        {
    
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=Metric&appid=${api_key}`
            response = await fetch(url);
            data = await response.json();

            setCurrentHumidity(data.main.humidity + " %");
            setCurrentWind(data.wind.speed + " km/h");
            setCurrentTemperature(data.main.temp + " °C")
            setMainWeatherDescription(getBackground([data.sys.sunrise, data.sys.sunset],  data.dt));
            setWeatherDescription(getImage(data.weather[0].main));
            setCurrentLatitude(lat);
            setCurrentLongitude(long);

        } catch(Error)
        {
            return 0;
        }
    
    }

    useEffect(() =>
    {
        getCoordinates();

    }, [])

    const search = async () => 
    {

        const elem = document.getElementsByClassName("cityOfWeather");

        if(elem[0].value === "")
        {
            return 0;
        }
    
        try 
        {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${elem[0].value}&units=Metric&appid=${api_key}`
        
            response = await fetch(url);
            data = await response.json();
            
            console.log(data.weather);
            

            setMainWeatherDescription(getBackground([data.sys.sunrise, data.sys.sunset], data.dt));
            setWeatherDescription(getImage(data.weather[0].main));
            
            const location = document.getElementsByClassName('locationTitle');
            location[0].innerHTML = data.name;
            
            setCurrentHumidity(data.main.humidity + " %");
            setCurrentWind(data.wind.speed + " km/h");
            setCurrentTemperature(data.main.temp + " °C");
    
        } catch(Error)
        {
            return 0;
        }  
       
    }
            
  return (

    <div>
        
        <img src = {mainWeatherDescription} id='wallpaper' alt='wallpaper'/> 
        
        <h1 class='title'>Weather Forecast</h1>
        <div className = 'current'>
            <h1>Date: {currentDate}</h1>
            <h1>Time: {currentTime}</h1>
        </div>
        <div class = 'text-container'>
            <input type = 'text' className ='cityOfWeather' placeholder='Enter the Location Name'></input>

            <div className= 'serachBarImage'>
                <img src={searchBar} class = 'search' onClick={search}/>
            </div>

        </div>
        
        <p class = 'locationTitle'>Your Location:</p>

        <img src = {weatherDescription} class = 'sunnyImage'/>

        

        <div class = 'humidity-block'>
            <img src={Humidity} class = 'humidity-image'/>
            <div className='humidity-rate'>{currentHumidity}</div>
            <div>Humidity</div>
        </div>   

        <div class='wind-block'>
            <img src={wind}/>
            <div className='wind-rate'>{currentWind}</div>
            <div>Wind</div>
        </div>

        <div className='temperature-rate'>{currentTemperature}</div>
            
    </div>

  )
}

export default SlideOne;
