import React, { useState } from 'react';
import { deleteItemFromCart } from "../../redux/cart/reducer";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { TbTemperatureCelsius } from 'react-icons/tb'
import { IoHeartOutline, IoClose } from 'react-icons/io5'
import { FcLike } from "react-icons/fc";
import { ImSpinner8 } from 'react-icons/im';

import './/style.scss';

const Item = ({ location, date, icon }) => {
    const dispatch = useDispatch();

    // Загрузка лайкнутых карточек из localStorage или создание пустого массива
    const [likedLocations, setLikedLocations] = useState(() => {
        const storedLocations = localStorage.getItem('likedLocations');
        return storedLocations ? JSON.parse(storedLocations) : [];
    });

    // Обработка нажатия на иконку "Лайк"
    const handleLike = (e, id) => {
        e.preventDefault();
        const existingIndex = likedLocations.findIndex((item) => item.id === id);
    
        if (existingIndex === -1) {
            const newLikedLocations = [
                ...likedLocations,
                { id: id, location: location }
            ];
            setLikedLocations(newLikedLocations);
            localStorage.setItem('likedLocations', JSON.stringify(newLikedLocations));
        } else {
            const updatedLocations = likedLocations.filter((_, index) => index !== existingIndex);
            setLikedLocations(updatedLocations);
            localStorage.setItem('likedLocations', JSON.stringify(updatedLocations));
        }
    };

    // Обработка нажатия на кнопку удаления карточки
    const handleDelete = (e) => {
        e.preventDefault();
        const itemID = location.params.meta.requestId;

        // Удаляем карточку из Redux store
        dispatch(deleteItemFromCart(itemID));

        // Удаляем карточку из localStorage и из likedLocations
        const updatedLikedLocations = likedLocations.filter((item) => item.id !== location.params.payload.city.id);
        setLikedLocations(updatedLikedLocations);
        localStorage.setItem('likedLocations', JSON.stringify(updatedLikedLocations));
    };

    return (
        <div className="content">
            { location?.params?.payload ? (
                <Link to={{
                    pathname: `/details/${location.params.payload.city.name}`,
                    state: { location }
                }}>
                    <div id={location.params.payload.city.id} key={location.params.payload.city.id}>
                        <div className="item">
                            <div className="item_top">
                                <button onClick={(e) => handleLike(e, location.params.payload.city.id)} className="ico-btn">
                                    { likedLocations.some((item) => item.id === location.params.payload.city.id) ? (
                                        <FcLike />
                                    ) : (
                                        <IoHeartOutline />
                                    )}
                                </button>
                                <button onClick={(e) => handleDelete(e)} className="ico-btn"><IoClose /></button>
                            </div>
                            <div className="item_content">
                                <div className="location">
                                    <div className="location_icon">{icon}</div>
                                    <div>
                                        <div className="location_city">{location.params.payload.city.name}, {location.params.payload.city.country}</div>
                                        <div className="location_date">{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}</div>
                                    </div>
                                </div>
                                <div className="temp">
                                    <div className="temp_num">{parseInt(location.params.payload.list[0].main.temp)}</div>
                                    <div className="temp_icon"><TbTemperatureCelsius /></div>
                                </div>
                                <div className="temp_description">{location.params.payload.list[0].weather[0].description}</div>
                            </div>
                        </div>
                    </div>
                </Link>
            ) : (
                <div className='spin'>
                    <ImSpinner8 className='spin_animate' />
                </div>
            )}
        </div>
    );
};

export default Item;