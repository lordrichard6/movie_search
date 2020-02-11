import React, {useReducer, useEffect} from 'react';
import './App.css';
import Header from './components/Header';
import Movie from './components/Movie';
import Search from './components/Search';

const MOVIE_API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=c28ca567'

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_MOVIES_REQUEST':
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
      case 'SEARCH_MOVIES_SUCCESS':
        return {
          ...state,
          loading: false,
          movies: action.payload
        };
      case 'SEARCH_MOVIES_FAILURE':
        return {
          ...state,
          loading: false,
          errorMessage: action.error
        };
      default:
        return state;
  }
};


const App = () => {
  // const [loading, setLoading] = useState(true);
  // const [movies, setMovies] = useState([]);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        // setMovies(jsonResponse.Search);
        // setLoading(false);
        dispatch({
          type: 'SEARCH_MOVIES_SUCCESS',
          payload: jsonResponse.Search
        })
      });
  }, []);

  const search = searchValue => {
    // setLoading(true);
    // setErrorMessage(null);
    dispatch({
      type: 'SEARCH_MOVIES_REQUEST'
    });

    fetch(`http://www.omdbapi.com/?=${searchValue}&apikey=c28ca567`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === 'True') {
          // setMovies(jsonResponse.Search);
          // setLoading(false);
          dispatch({
            type: 'SEARCH_MOVIES_SUCCESS',
            payload: jsonResponse.Search
          })
        } else {
          // setErrorMessage(jsonResponse.Error);
          // setLoading(false);
          dispatch({
            type: 'SEARCH_MOVIES_FAILURE',
            error: jsonResponse.ESrror
          });
        }
    });
  };

  const {movies, errorMessage, loading} = state;

  return (
    <div className="App">
      <Header text="What's the name of that movie??" />
      <Search search={search} />
      <p className='App-intro'>Some of our favourite movies</p>
      <div className='movies'>
        {loading && !errorMessage ? 
          (<span>loading...</span>) : errorMessage ? 
          (<div className='errorMessage'>{errorMessage}</div>) : 
          (movies.map((movie, index) => (<Movie key={`${index}-${movie.Title}`} movie={movie} />))) 
        } 
      </div>
    </div>
  );
}

export default App;
