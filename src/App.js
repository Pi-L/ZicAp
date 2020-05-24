import React from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import ResultsContainer from './components/ResultsContainer';
import * as api from './api/musicBrainAPI';


// todo : check async logique
export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nbResults: null,
      results: [],
      loading: false,
      errors: [],
      showMoreResultsButton: false,
      showPopinDetails: false,
    }

    this.currentSearch = {
      offset: 0,
      query: '',
      option: '',
    }
  }

  search = async (query, option, currentOffset = 0) => {

    this.setState({
      loading: true,
    });

    if (currentOffset === 0)
      this.currentSearch.offset = 0;

    try {
      const response = await api.getData(option, query, currentOffset);

      if (response.error === '') {

        this.currentSearch = {
          offset: this.currentSearch.offset + 100,
          query: query,
          option: option,
        }

        this.setState({
          nbResults: response.nbResults,
          results: currentOffset === 0 ? response.results : this.state.results.concat(response.results),
          showMoreResultsButton: this.currentSearch.offset < response.nbResults,
          loading: false,
        });

      } else {
        this.setState({
          loading: false,
          errors: this.state.errors.concat(response.error),
        });
      }
    }
    catch (error) {
      this.setState({
        loading: false,
        errors: this.state.errors.concat(error),
      });
    }

  }

  updateSearch = () => {
    const { query, option, offset } = this.currentSearch;
    this.search(query, option, offset);
  }

  render() {
    const { nbResults, results, loading, errors, showMoreResultsButton }
      = this.state;

    return (
      <div className="App">
        <Header />
        <Nav action={this.search} />
        <ResultsContainer
          nbResults={nbResults}
          results={results}
          loading={loading}
          errors={errors}
          moreResults={showMoreResultsButton}
          action={this.updateSearch}
        />
      </div>
    );
  }
}

