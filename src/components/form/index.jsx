import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IoSearch } from 'react-icons/io5';
import { fetchWeather, addItemToCart } from "../../redux/cart/reducer";

import './/style.scss';

function Form() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleInput = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      setError('Введите название города!');
      return;
    }
  
    const weatherData = await dispatch(fetchWeather({ name: inputValue }));
  
    if (weatherData.payload.cod !== '200') {
      setError('Город с таким названием не найден!');
    } else {
      dispatch(addItemToCart({ params: weatherData }));
      setError('');
    }

    setInputValue('');
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div className={error ? "error active" : "error"}>
        <p className="error_message">{error}</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          onChange={handleInput}
          type="text"
          name="city"
          value={inputValue}
          className="form_input"
          placeholder="Введите город"
        />
        <button type="submit" className="form_button">
          <IoSearch />
        </button>
      </form>
    </>
  );
}

export default Form;