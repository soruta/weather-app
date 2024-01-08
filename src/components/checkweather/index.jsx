import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../../redux/cart/reducer';
import { addItemToCart } from '../../redux/cart/reducer';
import { BsCloudDrizzleFill } from 'react-icons/bs'
import { IoSunny, IoRainy, IoCloudy, IoSnow, IoThunderstorm } from 'react-icons/io5'
import { TbMist } from 'react-icons/tb'

import './/style.scss';

import Form from "../form/index";
import Item from "../item/index";

// Функция для отображения иконки в зависимости от типа погоды
export const getWeatherIcon = (weatherMain) => {
  switch (weatherMain) {
    case 'Clear':
      return <IoSunny className="color-yellow" />;
    case 'Clouds':
      return <IoCloudy />;
    case 'Snow':
      return <IoSnow className="color-blue" />;
    case 'Rain':
      return <IoRainy className="color-blue" />;
    case 'Drizzle':
      return <BsCloudDrizzleFill className="color-dark-blue" />;
    case 'Thunderstorm':
      return <IoThunderstorm className="color-dark-blue" />;
    case 'Mist':
      return <TbMist className="color-gray" />;
    default:
      return null;
  }
}

const getIcon = (location) => {
  if (location.params.payload.list) {
    return location.params.payload.list[0].weather[0].main;
  }
  return null;
};

function CheckWeather() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.cart.itemsInCart);
  const date = new Date();

  // При загрузке страницы добавляем лайкнутые карточки из localStorage в itemsInCart
  useEffect(() => {
    const likedLocations = JSON.parse(localStorage.getItem('likedLocations')) || [];
    likedLocations.forEach((item) => {
      dispatch(addItemToCart(item.location)); // Добавляем данные карточки в itemsInCart
    });
  }, [dispatch]);

  return (
    <div className="app">
      <div className="container">
        <Form />
      </div>
      <div className="container">
        <div className="app_block">
          {data.map((location, index) => (
            <Item key={index} location={location} date={date} icon={getWeatherIcon(getIcon(location))} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckWeather;