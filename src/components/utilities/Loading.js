import React from 'react';

function Loading(props) {
    const { toggle } = props;

    if (toggle) {
        return (
            <div className="loader-container" >
                <div className="loader"></div>
            </div >
        );
    }
    else {
        return null;
    }
}

export default Loading;



