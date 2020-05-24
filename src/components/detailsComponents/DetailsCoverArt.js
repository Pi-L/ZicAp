import React from 'react';

function DetailsCoverArt(props) {
    const { imagesSrc } = props;

    return (
        <section className="popinDetails__coverArt">
            <h4>Cover Art</h4>
            {
                imagesSrc.map((imgSrc, i) =>
                    <img key={i} src={imgSrc} alt='Cover Art' />)
            }
        </section>
    );
}

export default DetailsCoverArt;