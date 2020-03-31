import React from "react";
import "./movie.scss";
import { Link } from "@reach/router";
import Img from "react-image";
import Loader from "../loader/Loader";

class Movie extends React.Component {
	render() {
		const {
			title,
			vote_average,
			release_date,
			poster_path,
			id
		} = this.props.movie;

		const date = new Date(release_date).getFullYear();

		return this.props.loading ? (
			<Loader />
		) : (
			<Link to={`${process.env.PUBLIC_URL}/movie/${id}`}>
				<div className="movie-wrap">
					<div className="img-wrap">
						<Img
							className="movie-image"
							src={
								poster_path
									? `https://image.tmdb.org/t/p/w342${poster_path}`
									: "https://via.placeholder.com/500x750/352943/FFFFFF?text=no+image+available"
							}
							alt="movie poster"
							loader={<Loader />}
							unloader={<h5>no available image</h5>}
						/>
						<div className="hover-title">{title}</div>
					</div>
					<div className="text-wrap">
						<div className="title-wrap">
							<h4>
								{title.length > 20
									? title.substring(0, 20) + "..."
									: title}
							</h4>
						</div>
						<div className="movie-info">
							<h3>
								<span className="icon">
									<img
										src="/img/star-icon.svg"
										alt="review"
									/>
								</span>
								{vote_average}
							</h3>
							<h3>
								<span className="icon calendar">
									<img
										src="/img/calendar-icon.svg"
										alt="calendar"
									/>
								</span>
								{date}
							</h3>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

export default Movie;
