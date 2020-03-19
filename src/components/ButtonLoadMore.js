import React from "react";
import { Consumer } from "./PageContext";

class ButtonLoadMore extends React.Component {
   render() {
      return (
         <Consumer>
            {context => (
               <div className={`btn-wrap ${this.props.movies.length ? " " : "remove"}`}>
                  <button
                     className="button"
                     onClick={context.handleLoadMore}
                     disabled={context.page === context.totalPages}
                  >
                     {context.page === context.totalPages ? "no more results" : "Load More"}
                  </button>
               </div>
            )}
         </Consumer>
      );
   }
}

export default ButtonLoadMore;
