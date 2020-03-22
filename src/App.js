import React from "react";
import { Router } from "@reach/router";
import Home from "./components/Home";
import SideBar from "./components/sidebar/SideBar";
import Header from "./components/header/Header";
import MovieDetails from "./components/movie-details/MovieDetails";
import "./App.scss";
import api from "./ApiData";
import Favorites from "./components/favorites/Favorites";
import SearchResults from "./components/search-results/SearchResults";
import { Provider } from "./components/PageContext";
import GenreResults from "./components/genre-results/GenreResults";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			isMenuVisible: false,
			movies: [],
			favorites: [],
			genreList: [],
			totalPages: null,
			activePath: "",
			activeGenre: "",
			activeGenreName: "",
			page: 1,
			searchQuery: "",
			handleLoadMore: this.handleLoadMore,
			stopLoading: this.stopLoading,
			sortBy: { label: "Popularity", value: "popularity.desc" }
		};
	}

	componentDidMount() {
		this.loadFavoritesFromLocalStorage();
	}

	stopLoading = () => {
		this.setState({ loading: false });
	};

	toggleMenu = () => {
		this.setState({ isMenuVisible: !this.state.isMenuVisible });
	};

	addToFavorites = movie => {
		this.setState({ favorites: [...this.state.favorites, movie] }, () => {
			localStorage.setItem(
				"movies",
				JSON.stringify(this.state.favorites)
			);
		});

		if (this.state.favorites.some(item => item.id === movie.id)) {
			this.removeFromFavorites(movie);
		}
	};

	removeFromFavorites = movie => {
		this.setState({
			favorites: this.state.favorites.filter(item => item.id !== movie.id)
		});
	};

	loadFavoritesFromLocalStorage = () => {
		const favorites = JSON.parse(localStorage.getItem("movies"));
		if (favorites) {
			this.setState({
				favorites: favorites,
				loading: false
			});
		}
	};

	fetchMovies = path => {
		api.movies(path).then(data =>
			this.setState({
				movies: data.results,
				page: 1,
				totalPages: data.total_pages,
				activePath: path,
				singleMovie: {},
				loading: false
			})
		);
		window.scrollTo(0, 0);
	};

	searchMovies = q => {
		api.search(q).then(data =>
			this.setState({
				movies: data.results,
				page: 1,
				totalPages: data.total_pages,
				activePath: "search/movie"
			})
		);
	};

	getGenre = (id, label, sortValue) => {
		api.moviesByGenre(id, sortValue).then(data => {
			this.setState({
				movies: data.results,
				activePath: "discover/movie",
				activeGenre: parseInt(id),
				activeGenreName: label,
				loading: false
			});
		});
	};

	updateSearchValue = value => {
		this.setState({ searchQuery: value });
	};

	resetGenreName = () => {
		this.setState({
			activeGenreName: "Select genre",
			activeGenre: ""
		});
	};

	setSort = sortValue => {
		this.setState({ sortBy: sortValue });
	};

	setActivePath = activePath => {
		this.setState({ activePath });
	};

	handleLoadMore = () => {
		const { page, totalPages } = this.state;

		this.setState(
			{
				page: page === totalPages ? totalPages : page + 1
			},
			() => {
				const page = `&page=${this.state.page}`;
				const { activePath, searchQuery, activeGenre } = this.state;

				api.loadMore(activePath, searchQuery, page, activeGenre).then(
					data =>
						this.setState({
							movies: [...this.state.movies, ...data.results]
						})
				);
			}
		);
	};

	render() {
		return (
			<div className="App">
				<SideBar
					fetchMovies={this.fetchMovies}
					data={this.state}
					displayFavorites={this.displayFavorites}
					isMenuVisible={this.state.isMenuVisible}
					toggleMenu={this.toggleMenu}
					getGenre={this.getGenre}
					setActivePath={this.setActivePath}
					setSort={this.setSort}
				/>
				<Header
					isMenuVisible={this.state.isMenuVisible}
					searchQuery={this.state.searchQuery}
					searchMovies={this.searchMovies}
					updateSearchValue={this.updateSearchValue}
					toggleMenu={this.toggleMenu}
					resetGenreName={this.resetGenreName}
				/>
				<Provider value={this.state}>
					<Router>
						<Home
							path="/"
							data={this.state}
							handleLoadMore={this.handleLoadMore}
							fetchMovies={this.fetchMovies}
							resetGenreName={this.resetGenreName}
						/>
						<MovieDetails
							path="/movie/:id"
							movieData={this.state}
							loading={this.state.loading}
							addToFavorites={this.addToFavorites}
							getGenre={this.getGenre}
							resetGenreName={this.resetGenreName}
							setSort={this.setSort}
						/>
						<Home
							path="/:activePath"
							data={this.state}
							handleLoadMore={this.handleLoadMore}
							fetchMovies={this.fetchMovies}
							resetGenreName={this.resetGenreName}
						/>
						<GenreResults
							path="/genres/:id"
							data={this.state}
							handleLoadMore={this.handleLoadMore}
							getGenre={this.getGenre}
							setSort={this.setSort}
						/>
						<SearchResults
							path="/search"
							data={this.state}
							handleLoadMore={this.handleLoadMore}
						/>
						<Favorites
							path="/favorites"
							data={this.state}
							loadFavoritesFromLocalStorage={
								this.loadFavoritesFromLocalStorage
							}
							resetGenreName={this.resetGenreName}
							setActivePath={this.setActivePath}
						/>
					</Router>
				</Provider>
			</div>
		);
	}
}

export default App;
