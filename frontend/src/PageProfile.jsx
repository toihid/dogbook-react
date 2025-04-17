import {
  Box,
  Image,
  Grid,
  HStack,
  Text,
  Avatar,
  Button,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function PageProfile() {
  const [dog, setDog] = useState([]);
  const { id } = useParams();

  const fetchDogById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/dogs/${id}`);
      setDog(response.data);
    } catch (error) {
      console.log("Error fetching dog:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchDogById(id);
  }, []);

  const handelClick = (id) => {
    fetchDogById(id);
  };

  return (
    <>
      <div className="container profile-page">
        <Grid
          templateColumns={["1fr", "1fr", "1fr 2fr 1fr"]}
          gap={6}
          width="1000px"
          maxW="100%"
          mx="auto"
        >
          <GridItem colSpan={3} textAlign="center">
            <HStack display="flex" justifyContent="space-between" pb={5}>
              <Heading as="h1" size="2xl" color="teal.500" mb={5}>
                Profile of the dog
              </Heading>
              <Box>
                <Link to={`/edit/${dog._id}`}>
                  <Button backgroundColor="teal.500" size="lg" mb={6} m={2}>
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/">
                  <Button backgroundColor="teal.500" size="lg" mb={6} m={2}>
                    Go to dog list
                  </Button>
                </Link>
              </Box>
            </HStack>
          </GridItem>
          <Box>
            <Avatar.Root
              css={{ width: "250px", height: "250px" }}
              colorPalette="pink"
            >
              <Avatar.Fallback name="Random" />
              <Avatar.Image
                src={`http://localhost:3000/uploads/${dog.image}`}
                alt={dog.name}
              />
            </Avatar.Root>
          </Box>
          <Box>
            <HStack>
              <Text className="field-name" color="teal.500">
                Name:{" "}
              </Text>
              <Text className="field-value">{dog.name}</Text>
            </HStack>
            <HStack>
              <Text className="field-name" color="teal.500">
                Nick:
              </Text>
              <Text className="field-value">{dog.nick}</Text>
            </HStack>
            <HStack>
              <Text className="field-name" color="teal.500">
                Bio:
              </Text>
              <Text className="field-value">{dog.bio}</Text>
            </HStack>
          </Box>
          <Box>
            <Text color="teal.500">Friends:</Text>
            <Box className="field-value">
              {dog &&
                dog.friends?.map((friend) => (
                  <HStack py={2} key={friend._id}>
                    <Avatar.Root
                      colorPalette="pink"
                      css={{ width: "50px", height: "50px" }}
                    >
                      <Avatar.Fallback name="Random" />
                      <Avatar.Image
                        src={`http://localhost:3000/uploads/${friend.image}`}
                      />
                    </Avatar.Root>
                    <Link
                      className="friend-url"
                      onClick={() => handelClick(friend._id)}
                      to={`/profile/${friend._id}`}
                    >
                      {friend.name}
                    </Link>
                  </HStack>
                ))}
            </Box>
          </Box>
        </Grid>
      </div>
    </>
  );
}

export default PageProfile;
