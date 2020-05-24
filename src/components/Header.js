import React from 'react';
import boombox from '../img/boombox.svg';

export default function Header() {

    return (
        <header className="pil-header">
            <img src={boombox} alt="logo" />
            <h1 className="container">Super Duper Music App</h1>
            <hr />
        </header>
    );

}