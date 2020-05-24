import timeConverter from '../helpers/helpers';

function getData(option, query, offset) {

    const response = {
        nbResults: 0,
        results: [],
        error: ''
    };

    // query builder
    let queryString;
    switch (option) {
        case 'artist':
            queryString = `* AND artist:"${query}"`;
            break
        case 'recording':
            queryString = `* AND recording:"${query}"`;
            break
        case 'release':
            queryString = `* AND release:"${query}"`;
            break;
        default:
            queryString = `"${query}"`;
            break;
    }
    queryString = encodeURIComponent(queryString);

    // endpoint removed as this is a exercise from CEFIM School
    return fetch(`https://musicbrainz.org/ws/2/<endpoint, ${queryString}, and params>`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.hasOwnProperty('error') && data.hasOwnProperty('count')) {
                response.nbResults = data.count;

                response.results = data.recordings.map(recording => {
                    let result = {
                        mbid: null,
                        artist: 'n\\a',
                        title: 'n\\a',
                        release: 'n\\a',
                    }

                    if (recording.hasOwnProperty('id'))
                        result.mbid = recording.id;

                    if (recording.hasOwnProperty('title'))
                        result.title = recording.title;
                    // Optional chaining operator would simplify things here
                    if (recording.hasOwnProperty('releases') && Array.isArray(recording.releases) && recording.releases.length > 0 && recording.releases[0].hasOwnProperty('title'))
                        result.release = recording.releases[0].title;

                    if (recording.hasOwnProperty('artist-credit') && Array.isArray(recording['artist-credit']) && recording['artist-credit'].length > 0 && recording['artist-credit'][0].hasOwnProperty('name'))
                        result.artist = recording['artist-credit'][0].name;

                    return result;
                });

                response.results = response.results.filter(result =>
                    result.id !== null && (result.title !== 'n\\a' || result.artist !== 'n\\a' || result.release !== 'n\\a')
                );

                return response;
            }
            else {
                response.error = 'MusicBrainz n\'accepte pas cette requete. Nous allons étudier le problème';
                // console.log(`${option} search - Failed to get results : `, data.error);
                throw response.error;
            }
        })
        .catch((error) => {
            response.error = 'MusicBrainz n\'est pas joignable. Veulliez verifier votre connexion internet';
            // console.log(`${option} search - Failed connection to api : `, error);
            throw response.error;
        }
        );
}

function getTrackInfos(mbid) {

    const response = {
        rating: null,
        duration: '',
        artistsNames: [],
        releasesIds: [],
        releasesTitles: [],
        genres: [],
        error: ''
    };

    // endpoint removed as this is a exercise from CEFIM School
    return fetch(`https://musicbrainz.org/ws/2/<endpoint, ${mbid}, and params>`)
        .then((res) => res.json())
        .then((data) => {

            if (!data.hasOwnProperty('error')) {

                response.rating = data.rating.hasOwnProperty('value') ? data.rating.value : null;
                response.duration = data.length ? timeConverter(data.length) : '';

                if (Array.isArray(data['artist-credit']) && data['artist-credit'].length > 0) {

                    void data['artist-credit'].map(({ name }) =>
                        response.artistsNames.push(name));

                    response.artistsNames = [...new Set(response.artistsNames)];
                }

                if (Array.isArray(data.releases) && data.releases.length > 0) {
                    void data.releases.map(({ title, id }) => {
                        response.releasesIds.push(id);
                        response.releasesTitles.push(title);
                        return null;
                    });

                    response.releasesIds = [...new Set(response.releasesIds)];
                    response.releasesTitles = [...new Set(response.releasesTitles)];
                }

                if (Array.isArray(data.genres) && data.genres.length > 0) {
                    void data.genres.map(({ name }) =>
                        response.genres.push(name));

                    response.genres = [...new Set(response.genres)];
                }
                return response;
            }
            else {
                response.error = 'MusicBrainz n\'accepte pas cette requete. Nous allons étudier le problème';
                // console.log(`TrackInfos - Failed to get details for track ${mbid} : `, data.error);
                throw response.error;
            }
        })
        .catch((error) => {
            response.error = 'MusicBrainz n\'est pas joignable. Veulliez verifier votre connexion internet';
            // console.log('TrackInfos - Failed connection to api : ', error);
            throw response.error;
        }
        );
}

function getCoverArt(mbid, abortSignal) {
    const response = {
        imagesSrc: [],
        error: ''
    };

    // endpoint removed as this is a exercise from CEFIM School
    return fetch(`https://coverartarchive.org/<endpoint, ${mbid}>`, abortSignal)
        .then((res) => res.json())
        .then((data) => {
            if (!data.hasOwnProperty('error') && data.hasOwnProperty('images')) {

                void data.images.map((image) => {
                    if (image.hasOwnProperty('thumbnails') && image.thumbnails.hasOwnProperty('small')) {
                        response.imagesSrc.push(image.thumbnails.small);
                    }
                    else if (image.hasOwnProperty('image')) {
                        response.imagesSrc.push(image.image);
                    }
                    return null;
                });
                return response;
            }
            else {
                response.error = 'Nous n\'avons pas trouvé de Cover Art pour ce morceau';
                // console.log(`CoverArt - Failed to get Covers for release ${mbid} : `, data.error);
                throw response.error;
            }

        })
        .catch((error) => {
            response.error = 'Nous n\'avons pas trouvé de Cover Art pour ce morceau';
            // console.log('CoverArt - Failed connection to api : ', error);
            throw response.error;
        }
        );
}

export { getData, getCoverArt, getTrackInfos };