import React from 'react';
import Observer from '@researchgate/react-intersection-observer';

import Result from './Result';
import DetailsContainer from './DetailsContainer';
import Loading from './utilities/Loading';
import Errors from './utilities/Errors';

export default class ResultsContainer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showPopinDetails: false,
            currentMbid: null,
            currentTitle: null,
            currentArtist: null,
            isObserverDisabled: false,
        }
    }

    handleIntersection = (e) => {
        if (e.isIntersecting) {
            this.setState({
                isObserverDisabled: true,
            });
            this.clickMore(e);
        }
    }

    observerOptions = {
        onChange: this.handleIntersection,
        root: null,
        rootMargin: '400px 0px',
    };

    clickMore = async (e) => {
        if (e.hasOwnProperty('type') && e.type === 'click')
            e.preventDefault();

        const button = e.target;
        this.props.action();

        // disable the button for 1s in order to avoid exceding the api limit
        button.classList.toggle('disabled');
        await new Promise(r => setTimeout(r, 1100));
        button.classList.toggle('disabled');
        this.setState({
            isObserverDisabled: false,
        });
    }

    showDetails = (e, mbid, title, artist) => {
        e.preventDefault();
        document.body.classList.add('popin');

        this.setState({
            showPopinDetails: true,
            currentMbid: mbid,
            currentTitle: title,
            currentArtist: artist,
        });
    }

    hideDetails = (e) => {
        e.preventDefault();
        document.body.classList.remove('popin');

        this.setState({
            showPopinDetails: false,
        });
    }

    render() {
        const { nbResults, results, loading, errors, moreResults } = this.props;
        const { showPopinDetails, currentMbid, currentTitle, currentArtist, isObserverDisabled } = this.state;

        const microComponent = {
            moreResults: moreResults ?
                <Observer {...this.observerOptions} disabled={isObserverDisabled}>
                    <button onClick={this.clickMore}>Plus de résultats</button>
                </Observer >
                : null,

            nbResults: nbResults !== null ? <p>{nbResults} résultat{nbResults > 1 ? 's' : ''}</p> : null,

            message: nbResults === null ?
                <p className='message'>Effectuez une recherche</p> : null,
        }

        return (
            <main>
                {microComponent.nbResults}
                <section className="results-container">
                    <div className="titles">
                        <p>#</p>
                        <p>Artiste</p>
                        <p>Titre</p>
                        <p>Album</p>
                        <p>Details</p>
                    </div>
                    {microComponent.message}
                    {
                        results.map((result, index) =>
                            <Result
                                key={index}
                                order={index + 1}
                                {...result}
                                showDetails={this.showDetails} />
                        )
                    }
                </section>
                <Loading toggle={loading} />
                {microComponent.moreResults}
                <Errors errors={errors} />

                {
                    showPopinDetails &&
                    <DetailsContainer
                        mbid={currentMbid}
                        title={currentTitle}
                        artist={currentArtist}
                        hideDetails={this.hideDetails} />
                }
            </main>
        );
    }
}