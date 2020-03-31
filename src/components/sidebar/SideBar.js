import React from "react";
import { Link, navigate } from "@reach/router";
import "./sidebar.scss";
import Select from "react-select";
import Loader from "../loader/Loader";
import api from "../../ApiData";

class SideBar extends React.Component {
	state = {
		loading: true,
		options: [],
		defaultSort: { label: "Popularity", value: "popularity.desc" },
		selectedGenre: {
			label: "",
			value: null
		},
		activePage: ""
	};

	static getDerivedStateFromProps(props) {
		return {
			selectedGenre: {
				label: props.data.activeGenreName,
				value: props.data.activeGenre
			},
			loading: false
		};
	}

	componentDidMount() {
		this.getGenreList();
	}

	getGenreList = async () => {
		api.genreList().then(data => {
			this.setState({
				options: data.genres.map(({ id, name }) => ({
					value: id,
					label: name
				}))
			});
		});
	};

	handleOverlayClick = () => {
		this.props.toggleMenu();
	};

	handleLinkClick = path => {
		this.props.setActivePath(path);
		this.props.toggleMenu();
	};

	handleSelectChange = genre => {
		navigate(`/genres/${genre.value}-${genre.label}`);

		this.props.getGenre(
			genre.value,
			genre.label,
			this.state.defaultSort.value
		);
		this.props.toggleMenu();
		this.props.setSort({ label: "Popularity", value: "popularity.desc" });

		this.setState({ loading: false, selectedGenre: genre });
	};

	render() {
		const path = this.props.data.activePath;

		return this.state.loading ? (
			<Loader />
		) : (
			<>
				<aside
					className={`sidebar ${
						this.props.isMenuVisible ? "show-sidebar" : ""
					}`}
				>
					<Link to={`${process.env.PUBLIC_URL}/`}>
						<div
							className="logo-wrap"
							onClick={() => {
								this.handleLinkClick("discover/movie");
							}}
						>
							<img src="img/moviez-logo.svg" alt="logo" />
						</div>
					</Link>

					<ul className="side-list">
						<Link to={`${process.env.PUBLIC_URL}/top_rated`}>
							<li
								className={`list-item ${
									path === "movie/top_rated" ? "active" : ""
								}`}
								onClick={() => {
									this.handleLinkClick("movie/top_rated");
								}}
							>
								Top Rated
							</li>
						</Link>
						<Link to={`${process.env.PUBLIC_URL}/upcoming`}>
							<li
								className={`list-item ${
									path === "movie/upcoming" ? "active" : ""
								}`}
								onClick={() => {
									this.handleLinkClick("movie/upcoming");
								}}
							>
								Upcoming
							</li>
						</Link>
						<Link to={`${process.env.PUBLIC_URL}/favorites`}>
							<li
								className={`list-item ${
									path === "movie/favorites" ? "active" : ""
								}`}
								onClick={() => {
									this.handleLinkClick("movie/favorites");
								}}
							>
								<div className="favorites">
									{this.props.data.favorites.length}
								</div>
								Favorites
							</li>
						</Link>
					</ul>
					<Select
						options={this.state.options}
						onChange={this.handleSelectChange}
						className={`select ${
							this.props.data.activeGenreName !== "Select genre"
								? "active"
								: ""
						}`}
						tabSelectsValue={false}
						classNamePrefix="select-item"
						openMenuOnFocus="true"
						value={this.state.selectedGenre}
						theme={theme => ({
							...theme,
							borderRadius: 0,
							colors: {
								...theme.colors,
								primary25: "#1e142c",
								primary: "#11081d"
							}
						})}
					/>
				</aside>
				<div
					className={`overlay ${
						this.props.isMenuVisible ? "show-overlay" : ""
					}`}
					onClick={this.handleOverlayClick}
				/>
			</>
		);
	}
}

export default SideBar;
