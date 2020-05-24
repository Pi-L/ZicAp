import React from 'react';

export default class Nav extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            option: 'all',
            err: '',
            isSearchDisabled: false,
        }
    }

    inputChange = (e) => {

        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitForm = async (e) => {
        const { query, option } = this.state;
        const { action } = this.props;

        e.preventDefault();

        if (query === '') {
            this.setState({
                err: 'error',
            });
        }
        else {
            this.setState({
                err: '',
                isSearchDisabled: true,
            });
            // todo : cleaner solution 
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
            await new Promise(r => setTimeout(r, 100));

            action(query, option, 0);

            // disable the form for 1s in order to avoid exceeding the api limit
            await new Promise(r => setTimeout(r, 1100));
            this.setState({
                err: '',
                isSearchDisabled: false,
            });
        }

    }

    keyDown = (e) => {
        if (e.key === 'Enter') {
            this.submitForm(e);
        }
    }

    render() {
        const { err, isSearchDisabled } = this.state;

        return (
            <nav className="pil-nav">
                <form onSubmit={this.submitForm}>
                    <fieldset disabled={isSearchDisabled}>
                        <div className="input-container">
                            <input
                                id="searchField"
                                name='query'
                                placeholder=" "
                                required
                                minLength="1"
                                onChange={this.inputChange}
                                className={err} />
                            <label htmlFor="searchField">Votre recherche</label>
                        </div>
                        <select id="selectOption" onKeyDown={this.keyDown} onChange={this.inputChange} alt="choisir le type de recherche" name="option">
                            <option value="all" defaultValue>All</option>
                            <option value="artist">Artiste</option>
                            <option value="recording">Titre</option>
                            <option value="release">Album</option>
                        </select>
                        <label htmlFor="selectOption" className="screen-reader-text-only">Choix du type de recherche</label>
                        <button name="searchButton" alt="Lancer la recherche">Recherche</button>
                    </fieldset>
                </form>
            </nav>
        );

    }


}