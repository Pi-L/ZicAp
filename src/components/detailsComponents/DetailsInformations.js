import React from 'react';
import DetailsStarRating from './DetailsStarRating';

function DetailsInformations(props) {

    const { title, artistsNames, releasesTitles, genres, duration, rating } = props;

    return (
        <section className="popinDetails__informations">
            <h4>Informations</h4>
            <p>Titre : {title}</p>
            {
                artistsNames.length > 0 &&
                <p>Artistes :
                {
                        artistsNames.map((artistName, index) => {
                            if (index === artistsNames.length - 1)
                                return ` ${artistName}`;
                            return ` ${artistName},`
                        })
                    }
                </p>
            }
            {
                releasesTitles.length > 0 &&
                <p>Albums :
                {
                        releasesTitles.map((release, index) => {
                            if (index === releasesTitles.length - 1)
                                return ` ${release}`;
                            return ` ${release},`
                        })
                    }
                </p>
            }
            {
                genres.length > 0 &&
                <p>Genres :
                {
                        genres.map((genre, index) => {
                            if (index === genres.length - 1)
                                return ` ${genre}`;
                            return ` ${genre},`
                        })
                    }
                </p>
            }
            {
                duration !== '' &&
                <p>Durée : {duration}</p>
            }
            {
                rating !== null &&
                <DetailsStarRating rating={rating} />
            }
        </section>
    );
}

export default DetailsInformations;
