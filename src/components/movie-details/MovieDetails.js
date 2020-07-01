import React from "react";
import "./movie-details.scss";
import Loader from "../loader/Loader";
import ReactPlayer from "react-player";
import Img from "react-image";
import api from "../../ApiData";
import { navigate } from "@reach/router";

class MovieDetails extends React.Component {
	state = {
		loading: true,
		allGenres: [],
		playVideo: false,
		trailer: null,
		singleMovie: {},
		isFavorite: false,
	};

	componentDidMount() {
		this.getMovie(`movie/${this.props.id}`);
		this.props.resetGenreName();
	}

	static getDerivedStateFromProps(prevProps) {
		if (
			prevProps.movieData.favorites.some(
				(item) => item.id === +prevProps.id
			)
		) {
			return { isFavorite: true };
		} else {
			return null;
		}
	}

	getMovie = (movieId) => {
		api.movie(movieId).then((data) =>
			this.setState({
				singleMovie: data,
				loading: false,
			})
		);
	};

	handleTrailerClick = () => {
		this.setState({ playVideo: true });
	};

	handleTrailerClose = () => {
		this.setState({ playVideo: false });
	};

	handleFavClick = () => {
		this.setState({ isFavorite: !this.state.isFavorite });
		const movie = this.state.singleMovie;
		this.props.addToFavorites(movie);
	};

	handleGenreClick = (id, name) => {
		this.props.getGenre(id, name);
		this.props.setSort({ label: "Popularity", value: "popularity.desc" });
		navigate(`/genres/${id}-${name}`);
	};

	render() {
		const {
			title,
			vote_average,
			runtime,
			release_date,
			overview,
			tagline,
			backdrop_path,
			genres,
			videos,
			credits,
		} = this.state.singleMovie;

		// format date
		const hours = Math.floor(runtime / 60);
		const min = runtime % 60;
		const options = { year: "numeric", month: "long", day: "numeric" };
		const date = new Date(release_date).toLocaleDateString(
			"en-US",
			options
		);

		let trailer;
		let director;
		let writer;

		if (!this.state.loading) {
			trailer = videos.results.find((video) => {
				return video.type === "Trailer" && video.site === "YouTube";
			});

			director = credits.crew.filter((crewMember) => {
				return (
					crewMember.department === "Directing" &&
					crewMember.job === "Director"
				);
			});
			writer = credits.crew.filter((crewMember) => {
				return crewMember.department === "Writing";
			});
		}

		return this.state.loading ? (
			<Loader />
		) : (
			<div className="movie-page">
				<div className="container">
					<div className="video-wrap">
						<div
							className={this.state.playVideo ? "open" : "close"}
						>
							{trailer ? (
								<ReactPlayer
									className="react-player"
									id="video"
									url={`https://www.youtube.com/embed/${trailer.key}`}
									width="100%"
									height="100%"
									key={trailer.id}
									playing={this.state.playVideo === true}
									controls={true}
								/>
							) : null}
							<button
								className="close-trailer"
								aria-label="Close trailer"
								onClick={this.handleTrailerClose}
							>
								&times;
							</button>
						</div>
					</div>
					<div className="img-wrap">
						<Img
							src={
								backdrop_path
									? `https://image.tmdb.org/t/p/original${backdrop_path}`
									: "https://via.placeholder.com/1280x720/352943/FFFFFF?text=no+image+available"
							}
							alt={title}
							// loader={<Loader />}
							unloader={<h5>no available image</h5>}
						/>
					</div>

					<div className="text-wrap">
						<div className="title-wrap">
							<div className="trailer">
								{trailer ? (
									<button
										className="play blurred"
										onClick={this.handleTrailerClick}
									>
										Play trailer
										<span>
											<img
												src="img/play-icon.svg"
												alt="play trailer"
											/>
										</span>
									</button>
								) : (
									<h5>No trailer available</h5>
								)}
							</div>
							<h2>{title}</h2>
							{tagline ? <h3>{` " ${tagline} "`}</h3> : null}
							<div className="genre-list">
								{genres.map((genre) => (
									<button
										className="blurred"
										key={genre.id}
										onClick={() =>
											this.handleGenreClick(
												genre.id,
												genre.name
											)
										}
									>
										{" "}
										{genre.name}{" "}
									</button>
								))}
							</div>
							<p className="desc">{overview}</p>
						</div>
						<div className="movie-details">
							<h4>
								<span className="star">
									<img src="img/star-icon.svg" alt="review" />
								</span>
								{vote_average}
							</h4>
							<h4>{date}</h4>

							{/*<span>*/}
							{/*   Runtime:{" "}*/}
							<h4>
								{hours} hr {min} min
							</h4>
							{/*</span>*/}
							<button
								className="no-style"
								onClick={this.handleFavClick}
							>
								<span
									className={`icon favorite ${
										this.state.isFavorite ? "pop" : ""
									}`}
								>
									<img
										src={
											this.state.isFavorite
												? "img/heart-fill-white.svg"
												: "img/heart-outline-white.svg"
										}
										alt="add to favorites"
									/>
								</span>
							</button>
						</div>
						<h5>
							Director:{" "}
							<span>{director.map((crew) => crew.name)}</span>
						</h5>
						<h5>
							Writers:{" "}
							<span>
								{[
									...new Set(
										writer.map((crew) => `${crew.name}, `)
									),
								]}
							</span>
						</h5>
						<section className="cast">
							<h5>Cast</h5>
							<ul className="cast-wrap">
								{credits.cast.slice(0, 6).map((castMember) => {
									return (
										<li
											key={castMember.cast_id}
											className="cast-card"
										>
											<div className="cast-img">
												<Img
													src={
														castMember.profile_path
															? `https://image.tmdb.org/t/p/w185${castMember.profile_path}`
															: "https://via.placeholder.com/300x450/352943/FFFFFF?text=no+image"
													}
													alt={castMember.name}
													loader={<Loader />}
													unloader={
														<h5>
															no image to display
														</h5>
													}
												/>
											</div>
											<div className="cast-info">
												<h4 className="name">
													{castMember.name}
												</h4>
												<h6 className="character">
													{castMember.character}
												</h6>
											</div>
										</li>
									);
								})}
							</ul>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default MovieDetails;
