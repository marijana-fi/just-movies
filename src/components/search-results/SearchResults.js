import React from "react";
import Movie from "../movie/Movie";
import ButtonLoadMore from "../ButtonLoadMore";

class SearchResults extends React.Component {
   render() {
      const { movies } = this.props.data;
      return (
         <>
            <div className="search-text">
               {this.props.data.movies.length ? (
                  <h4>
                     Search results for <span>{this.props.data.searchQuery}</span>
                  </h4>
               ) : (
                  <h4>
                     No results found for
                     <span>{this.props.data.searchQuery}</span>
                  </h4>
               )}
            </div>

            <div className="content search-page">
               {movies.map(movie => {
                  return <Movie key={movie.id} movie={movie} data={this.props.state} />;
               })}
            </div>
            <ButtonLoadMore movies={this.props.data.movies} />
         </>
      );
   }
}

export default SearchResults;
