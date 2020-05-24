function timeConverter(ts) {
    let minutes = 0;
    let seconds = 0;

    if (ts) {
        ts /= 1000;
        seconds = Math.floor(ts % 60) > 0 ? `${Math.floor(ts % 60)}s` : '';
        minutes = Math.floor(ts / 60) > 0 ? `${Math.floor(ts / 60)}min` : '';
        return `${minutes} ${seconds}`
    }

    return null;
}

export default timeConverter;