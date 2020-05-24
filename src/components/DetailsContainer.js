import React from 'react';
import * as api from '../api/musicBrainAPI';
import DetailsCoverArt from './detailsComponents/DetailsCoverArt';
import DetailsInformations from './detailsComponents/DetailsInformations';
import Loading from './utilities/Loading';
import Errors from './utilities/Errors';


export default class DetailsContainer extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            loadingInformations: false,
            loadingCoverArt: false,
            rating: null,
            duration: '',
            artistsNames: [],
            releasesTitles: [],
            genres: [],
            imagesSrc: [],
            errors: []
        }
    }
    // not needed in states
    releasesIds = [];
    // in order to prevent memory leaks and useless queries when the user closes the popin before it is done loading
    myAbortController = new AbortController();
    myAbortSignal = this.myAbortController.signal;

    setTrackInfos = (response, abortSignal) => {
        return new Promise((resolve, reject) => {
            if (response.error === '') {
                if (!abortSignal.signal.aborted) {
                    this.releasesIds = response.releasesIds;

                    this.setState({
                        loadingInformations: false,
                        rating: response.rating,
                        duration: response.duration,
                        artistsNames: response.artistsNames,
                        releasesTitles: response.releasesTitles,
                        genres: response.genres,
                    });
                }

                resolve(response.releasesIds);

            } else {
                if (!abortSignal.signal.aborted) {
                    this.setState({
                        loadingInformations: false,
                        errors: this.state.errors.concat(response.err),
                    });
                }

                reject(null);
            }
        })
    }

    setCoverArt = async (mbids, abortSignal) => {
        const myMbids = [];
        const myErrors = [];

        if (!abortSignal.signal.aborted && mbids.length === 0) {
            this.setState({
                loadingCoverArt: false,
                errors: [...new Set(this.state.errors.concat('Nous n\'avons pas trouvé de Cover Art pour ce morceau'))],
            });
            return false;
        }

        // many releases can be associated with a track, and each release may have various cover art
        // so we fetch cover arts for each of them
        // since their is a limit of 1 request per second on musicbrainz apis, we wait for each request to end before sending a new one, and we also wait 1s between each request (starting before the 1st one since it comes right after the getTrackInfos() call)

        for (let i = 0; i < mbids.length; i++) {
            if (!abortSignal.signal.aborted) {
                await new Promise(r => setTimeout(r, 1000));
                try {
                    let response = await api.getCoverArt(mbids[i], abortSignal);
                    myMbids.push(...response.imagesSrc);
                }
                catch (error) {
                    myErrors.push(error);
                }
            }
        }
        if (!abortSignal.signal.aborted) {
            this.setState({
                loadingCoverArt: false,
                imagesSrc: myMbids,
                // those are errors for the user. So we only keep one of each
                errors: [...new Set(this.state.errors.concat(myErrors))],
            });
        }
    }

    componentDidMount() {
        this.setState({
            loadingInformations: true,
            loadingCoverArt: true,
        });

        api.getTrackInfos(this.props.mbid, { signal: this.myAbortSignal })
            .then(response => this.setTrackInfos(response, { signal: this.myAbortSignal }))
            .then(response => this.setCoverArt(response, { signal: this.myAbortSignal }));
    }

    componentWillUnmount() {
        this.myAbortController.abort();
    }

    render() {
        const { title, artist, hideDetails } = this.props;
        const { imagesSrc, artistsNames, releasesTitles, genres, duration, rating, loadingInformations, loadingCoverArt, errors } = this.state;

        return (

            <aside className="popinDetails">
                <section className="popinDetails__header">
                    <h3 className="title">{title} - {artist}</h3>
                    <button onClick={hideDetails} className="closer">X</button>
                </section>
                <hr />
                <DetailsInformations
                    title={title}
                    artistsNames={artistsNames}
                    releasesTitles={releasesTitles}
                    genres={genres}
                    duration={duration}
                    rating={rating} />
                <Loading toggle={loadingInformations} />
                <hr />
                <DetailsCoverArt imagesSrc={imagesSrc} />
                <Loading toggle={loadingCoverArt} />
                {
                    imagesSrc.length === 0 &&
                    <Errors errors={errors} />
                }
                {/* <DetailsMessage
                    loadingCoverArt={loadingCoverArt}
                    errors={errors}
                    imagesSrc={imagesSrc} /> */}
            </aside>
        );

    }
}