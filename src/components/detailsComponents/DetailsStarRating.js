import React, { useEffect } from 'react';

const DetailsStarRating = (props) => {
    const { rating } = props;

    useEffect(() => {
        document.body.style.setProperty('--starRating', `${rating / 5 * 100}%`);

    }, [rating]);

    return (
        <div className="starRating--component">
            <p>Note : </p>
            <div className="stars" aria-label={`Noté ${rating} sur 5`}>
            </div>
        </div>

    );

}

export default DetailsStarRating;