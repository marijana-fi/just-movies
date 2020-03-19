import React from "react";
import Movie from "../movie/Movie";

class Favorites extends React.Component {
   componentDidMount() {
      this.props.setActivePath("movie/favorites");
      this.props.loadFavoritesFromLocalStorage();
      this.props.resetGenreName();
   }

   render() {
      const { favorites } = this.props.data;

      return !favorites.length ? (
         <div className="content">
            <h3>No favorites added</h3>
         </div>
      ) : (
         <>
            <div className="content">
               {favorites.map(movie => {
                  return <Movie key={movie.id} movie={movie} data={this.props.state} />;
               })}
            </div>
         </>
      );
   }
}

export default Favorites;
