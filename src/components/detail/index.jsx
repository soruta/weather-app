import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchWeather } from "../../redux/cart/reducer";
import { getWeatherIcon } from '../checkweather/index';
import { TbTemperatureCelsius, TbGaugeFilled } from 'react-icons/tb'
import { FaWind } from "react-icons/fa";
import { FaTemperatureArrowUp, FaTemperatureArrowDown, FaDroplet } from "react-icons/fa6";
import { ImSpinner8 } from 'react-icons/im';

import './style.scss';

const LocationDetails = () => {
  const dispatch = useDispatch();
  const { cityName } = useParams();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [randomImage, setRandomImage] = useState('');

  // Получение случайного изображения города при загрузке страницы
  useEffect(() => {
    const getRandomImage = async () => {
      const cityImages = [
        'city-1.jpg',
        'city-2.jpg',
        'city-3.jpg',
        'city-4.jpg',
        'city-5.jpg',
        'city-6.jpg',
        'city-7.jpg',
        'city-8.jpg',
        'city-9.jpg',
        'city-10.jpg'
      ];

      const randomIndex = Math.floor(Math.random() * cityImages.length);
      const randomImageUrl = `/files/images/${cityImages[randomIndex]}`;
      
      setRandomImage(randomImageUrl);
    };

    getRandomImage();
  }, []);

  // Получение данных о погоде при загрузке страницы
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchWeather(cityName));
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [dispatch, cityName]);

  // Вывод спиннера загрузки при ожидании данных о погоде
  if (loading) {
    return (
      <div className='spin'>
        <ImSpinner8 className='spin_animate' />
      </div>
    );
  }

  // Получение и обработка данных о погоде для отображения на странице
  const icon = getWeatherIcon(weatherData?.payload.list[0].weather[0].main);

  // Фильтрация данных о погоде для отображения прогноза на сутки
  const filteredData = weatherData.payload.list.map((item, index) => {
    if (index % 2 === 0) {
      return item;
    }
    return null;
  }).filter(item => item !== null);
  
  // Формирование массива времени суток
  const dayWeather = Array.from({ length: 4 }, (_, index) => index + 1);
  const timesDay = [
    'Утро',
    'День',
    'Вечер',
    'Ночь'
  ];

  // Формирование массива значений температур
  const temperatures = weatherData.payload.list.map(item => item.main.temp);
  const minTemperature = Math.min(...temperatures);
  const maxTemperature = Math.max(...temperatures);

  return (
    <div className="app_detail">
      <div className="container">
        <div className="content">
          <h2>Текущая погода</h2>
          <div className="content_top">
            <div className="image">
              {randomImage && <img src={randomImage} alt='Изображение города' />}
            </div>
            <div className="location">
              <h3 className="location_name">{weatherData.payload.city.name}</h3>
              <div className='location_content'>
                <span className="location_icon">{icon}</span>
                <div className='location_temp'>
                  <p className="location_temp_num">{parseInt(weatherData.payload.list[0].main.temp)}</p>
                  <span className="location_temp_icon"><TbTemperatureCelsius /></span>
                </div>
              </div>
              <p className="location_description">{weatherData.payload.list[0].weather[0].description}</p>
            </div>
            <div className="extra">
              <p className='extra_text'>Ощущается как: {parseInt(weatherData.payload.list[0].main.feels_like)}<TbTemperatureCelsius /></p>
              <div className="extra_bar">
                <div className="bar_item">
                  <span className='bar_item_icon hot'><FaTemperatureArrowUp /></span>
                  <p className='bar_item_temp'>{parseInt(maxTemperature)}<TbTemperatureCelsius /></p>
                </div>
                <div className="bar_item">
                  <span className='bar_item_icon cold'><FaTemperatureArrowDown /></span>
                  <p className='bar_item_temp'>{parseInt(minTemperature)}<TbTemperatureCelsius /></p>
                </div>
              </div>
              <div className="extra_info">
                <div className="info_item">
                  <span className="info_item_icon"><FaDroplet /></span>
                  <p className="info_item_text">Влажность: <span>{parseInt(weatherData.payload.list[0].main.humidity)} %</span></p>
                </div>
                <div className="info_item">
                  <span className="info_item_icon"><FaWind /></span>
                  <p className="info_item_text">Ветер: <span>{parseInt(weatherData.payload.list[0].wind.speed)} км/ч</span></p>
                </div>
                <div className="info_item">
                  <span className="info_item_icon"><TbGaugeFilled /></span>
                  <p className="info_item_text">Давление: <span>{parseInt(weatherData.payload.list[0].main.pressure)} Па</span></p>
                </div>
              </div>
            </div>
          </div>
          <h2>Прогноз на сутки</h2>
          <div className="content_bottom">
            <div className="content_bottom_blocks">
              {dayWeather.map((item, index) => (
                <div key={item} className="block">
                  <p className='block_title'>{timesDay[index]}</p>
                  <span className='block_icon'>{getWeatherIcon(filteredData[index].weather[0].main)}</span>
                  <p className='block_temp'>{parseInt(filteredData[index].main.temp)}<span><TbTemperatureCelsius /></span></p>
                  <p className='block_description'>{filteredData[index].weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;