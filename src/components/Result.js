import React from 'react';
import plusSign from '../img/plusblue.svg';

export default class Results extends React.PureComponent {

    render() {
        const { order, mbid, artist, title, release, showDetails } = this.props;

        return (
            <article className="results">
                <p>{order}</p>
                <p>{artist}</p>
                <p>{title}</p>
                <p>{release}</p>
                <button onClick={(e) => showDetails(e, mbid, title, artist)}><img src={plusSign} alt="Plus d'infos" /></button>
            </article>

        );

    }
}