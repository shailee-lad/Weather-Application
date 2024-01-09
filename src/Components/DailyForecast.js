import React, { Component } from 'react'
import image from './wallpaper.webp'
import './style.css'

class DailyForecast extends Component
{
    render()
    {
        return (
            <div>
                <img src = {image} id='wallpaper' alt='wallpaper'/> 
                <h1 id='title'>Winnipeg</h1>  
            </div>
        );
    }
}


export default DailyForecast;