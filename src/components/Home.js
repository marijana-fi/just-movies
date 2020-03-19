import React from "react";
import Movie from "./movie/Movie";
import ButtonLoadMore from "./ButtonLoadMore";

class Home extends React.Component {
   state = {
      path: ""
   };
   static getDerivedStateFromProps(nextProps) {
      if (nextProps.uri === "/") {
         return { path: "discover/movie" };
      } else {
         return { path: `movie${nextProps.uri}` };
      }
   }
   componentDidMount() {
      this.props.fetchMovies(this.state.path);
      this.props.resetGenreName();
   }
   componentDidUpdate(prevProps, prevState) {
      //fetch on path change
      if (prevState.path !== this.state.path) {
         this.props.fetchMovies(this.state.path);
      }
   }
   render() {
      const { movies } = this.props.data;

      return (
         <>
            <div className="content">
               {movies.map(movie => {
                  return <Movie key={movie.id} movie={movie} />;
               })}
            </div>
            <ButtonLoadMore movies={this.props.data.movies} />
         </>
      );
   }
}

export default Home;
