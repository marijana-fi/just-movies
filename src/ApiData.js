const axios = require("axios");
const key = process.env.REACT_APP_API_KEY;

const BASE = "https://api.themoviedb.org/3/";
const API_KEY = `?api_key=${key}`;

const success = ({ data }) => data;

const fail = err => {
	switch (err.status) {
		case 400:
			console.error("API error: invalid parameters");
			break;
		case 401:
			console.error("API error: insufficient credentials");
			break;
		case 403:
			console.error("API error: insufficient access");
			break;
		case 404:
			console.error("API error: endpoint not found");
			break;
		default:
			console.error("Something went wrong");
	}
	return err;
};

const makeRequest = (path, query = "", page = "", sort = "") =>
	axios
		.get(`${BASE}${path}${API_KEY}${query}${sort}${page}&region=US`)
		.then(success, fail);

const api = {
	movies(path) {
		return makeRequest(path);
	},
	search(q) {
		return makeRequest("search/movie", `&query=${q}`);
	},
	loadMore(path, searchQuery, page, genreId) {
		return makeRequest(
			path,
			`&query=${searchQuery}&with_genres=${genreId}`,
			page
		);
	},
	movie(path) {
		return makeRequest(path, `&append_to_response=videos,credits`);
	},
	genreList() {
		return makeRequest("genre/movie/list");
	},
	moviesByGenre(id, sortValue = "popularity.desc") {
		return makeRequest(
			"discover/movie",
			`&with_genres=${id}`,
			"",
			`&sort_by=${sortValue}`
		);
	}
};

export default api;
