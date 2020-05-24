import React from 'react';

function Errors(props) {
    const { errors } = props;

    if (errors.length > 0) {
        return (
            <aside className="errors__container">
                {
                    errors.map((error, i) =>
                        <p key={i} className="errorMessage">{error}</p>
                    )
                }
            </aside>
        );
    }
    else {
        return null;
    }
}

export default Errors;