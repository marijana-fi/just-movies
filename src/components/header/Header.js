import React from "react";
import "./header.scss";
import { navigate } from "@reach/router";

class Header extends React.Component {
	state = {
		isFocused: false
	};

	handleFocus = () => {
		this.setState({ isFocused: true });
	};

	handleBlur = () => {
		this.setState({ isFocused: false });
	};

	handleMenuClick = () => {
		this.props.toggleMenu();
	};
	handleLogoClick = () => {
		this.props.toggleMenu();
		navigate("/");
	};

	handleSubmit = e => {
		e.preventDefault();

		const q = e.currentTarget.search.value.trim();

		if (q === "") {
			e.currentTarget.search.value = "";
			return;
		}

		this.props.searchMovies(q);
		this.props.updateSearchValue(q);
		e.currentTarget.search.value = "";
		navigate("/search");
		this.props.resetGenreName();
	};

	render() {
		const { isMenuVisible } = this.props;
		const { isFocused } = this.state;

		return (
			<div className="header">
				{isMenuVisible}
				<div
					className="logo-wrap"
					aria-hidden={window.innerWidth > 768}
					onClick={
						isMenuVisible
							? this.handleLogoClick
							: () => navigate("/")
					}
				>
					{" "}
					<img src="img/logo-mobile.svg" alt="logo" />
				</div>
				<div
					className={`search-wrap blurred ${
						isMenuVisible ? "hide" : ""
					} ${isFocused ? "focused" : ""}`}
				>
					<span className="icon">
						<img src="img/search-icon.svg" alt="search" />
					</span>
					<form
						action=""
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						onSubmit={this.handleSubmit}
					>
						<input
							type="search"
							name="search"
							autoComplete="off"
							aria-label="search"
							required
						/>
					</form>
				</div>
				<div
					className={isMenuVisible ? "menu open" : "menu"}
					onClick={this.handleMenuClick}
				>
					<span />
					<span />
				</div>
			</div>
		);
	}
}

export default Header;
