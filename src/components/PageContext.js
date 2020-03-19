import React from "react";
const PageContext = React.createContext({
   page: "",
   totalPages: "",
   handleLoadMore() {},
   loading: true,

});

export const Provider = PageContext.Provider;
export const Consumer = PageContext.Consumer;
