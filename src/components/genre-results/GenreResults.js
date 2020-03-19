import React from "react";
import Movie from "../movie/Movie";
import ButtonLoadMore from "../ButtonLoadMore";
import Select from "react-select";
import "./genre-results.scss";

class GenreResults extends React.Component {
   state = {
      id: null,
      label: "",
      default: { label: "Popularity", value: "popularity.desc" },
      options: [
         { label: "Popularity", value: "popularity.desc" },
         {
            label: "Release date",
            value: "primary_release_date.desc"
         },
         {
            label: "Vote average",
            value: "vote_average.desc"
         }
      ]
   };

   static getDerivedStateFromProps(nextProps) {
      const genre = nextProps.id.split("-");
      return { id: genre[0], label: genre[1] };
   }

   componentDidMount() {
      this.props.getGenre(this.state.id, this.state.label, this.state.default.value);
   }

   handleSelectChange = sort => {
      this.props.getGenre(this.state.id, this.state.label, sort.value);
      this.props.setSort(sort);
   };
   render() {
      const { movies } = this.props.data;
      return (
         <>
            <div className="sort-list">
               <Select
                  options={this.state.options}

                  className="select sort"
                  classNamePrefix="select-item"
                  value={this.props.data.sortBy}
                  onChange={this.handleSelectChange}
                  openMenuOnFocus="true"
                  tabSelectsValue={false}
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
            </div>
            <div className="content genre">
               {movies.map(movie => {
                  return <Movie key={movie.id} movie={movie} data={this.props.state} />;
               })}
            </div>
            <ButtonLoadMore movies={this.props.data.movies} />
         </>
      );
   }
}

export default GenreResults;
