import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Avatar,
  Text,
  VStack,
  defineStyle,
  Heading,
  Button,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";

import Card from "./components/Card";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

function PageHome() {
  const [dogs, setDogs] = useState([]);

  const baseUrl = "https://dogbook-react-backend.vercel.app/dogs";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(baseUrl);
      setDogs(res.data); // assumes the API returns an array of users
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteDog = async (dogId) => {
    try {
      const res = await axios.delete(`http://localhost:3000/dogs/${dogId}`);
      // Optionally refresh your dog list here
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <Grid
        templateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
        gap={6}
        my={5}
        mx="auto"
        className="container"
      >
        <GridItem colSpan={3} textAlign="center">
          <HStack display="flex" justifyContent="space-between">
            <Heading as="h1" size="2xl" color="teal.500" mb={5}>
              Meet the dogs
            </Heading>
            <Link to="/new">
              <Button backgroundColor="teal.500" size="lg" mb={6} m={2}>
                Add New Dog
              </Button>
            </Link>
          </HStack>
        </GridItem>

        {dogs && dogs.map((dog) => <Card key={dog._id} dog={dog} />)}
      </Grid>
    </>
  );
}

export default PageHome;
