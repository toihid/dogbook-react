import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageHome from "./PageHome";
import PageProfile from "./PageProfile";
import PageNotFound from "./PageNotFound";
import PageNewDog from "./PageNewDog";
import PageEditDog from "./PageEditDog";

import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50" // optional background color
    >
      <BrowserRouter>
        <Routes>
          {/* Define routes here using the "element" prop */}
          <Route path="/" element={<PageHome />} />
          <Route path="/profile/:id" element={<PageProfile />} />
          <Route path="/new" element={<PageNewDog />} />
          <Route path="/edit/:id" element={<PageEditDog />} />
          {/* You can create a catch-all route for handling 404 pages */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Flex>
  );
}

export default App;
