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
    const [likedLocations, setLikedLocations] = useState(() => {
        const storedLocations = localStorage.getItem('likedLocations');
        return storedLocations ? JSON.parse(storedLocations) : [];
    });
    
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

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteItemFromCart(location?.params?.meta?.requestId));
    };

    return (
        <div className="content">
            { location?.params ? (
                <Link to={{
                    pathname: `/details/${location?.params?.payload?.city?.name}`,
                    state: { location }
                }}>
                    <div id={location?.params?.payload?.city?.id} key={location?.params?.payload?.city?.id}>
                        <div className="item">
                            <div className="item_top">
                                <button onClick={(e) => handleLike(e, location?.params?.payload?.city?.id)} className="ico-btn">
                                    { likedLocations.some((item) => item.id === location?.params?.payload?.city?.id) ? (
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
                                        <div className="location_city">{location?.params?.payload?.city?.name}, {location?.params?.payload?.city?.country}</div>
                                        <div className="location_date">{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}</div>
                                    </div>
                                </div>
                                <div className="temp">
                                    <div className="temp_num">{location.params.payload.list && parseInt(location.params.payload.list[0].main.temp)}</div>
                                    <div className="temp_icon"><TbTemperatureCelsius /></div>
                                </div>
                                <div className="temp_description">{location.params.payload.list && location.params.payload.list[0].weather[0].description}</div>
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