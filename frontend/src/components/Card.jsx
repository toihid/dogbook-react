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

import { Link } from "react-router-dom";

const Card = ({ dog }) => {
  if (!dog) return null;
  return (
    <Box
      key={dog._id}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={4}
      p={4}
      bg={dog.isPresent ? "teal.500" : "gray.100"}
      borderRadius="lg"
      boxShadow="md"
    >
      <Avatar.Root
        css={{ width: "100px", height: "100px" }}
        colorPalette="pink"
      >
        <Avatar.Fallback name="Random" />
        <Avatar.Image
          src={`http://localhost:3000/uploads/${dog.image}`}
          alt={dog.name}
        />
      </Avatar.Root>

      <Box
        key={dog._id}
        fontSize="lg"
        fontWeight="bold"
        flex="2"
        display="flex"
        justifyContent="space-between"
      >
        <Link to={`/profile/${dog._id}`}>
          <HStack>
            <Text>Name:</Text>
            <Text>{dog.name}</Text>
          </HStack>
          <HStack>
            <Text>Nick: </Text>
            <Text>{dog.nick}</Text>
          </HStack>
          <HStack>
            <Text>Age: </Text>
            <Text>{dog.age}</Text>
          </HStack>
          <HStack>
            <Text>IsPresent: </Text>
            <Text>{dog.isPresent ? "Yes" : "No"}</Text>
          </HStack>
        </Link>

        <Button
          background="none"
          color="red"
          p={0}
          m={0}
          fontWeight="bolder"
          textAlign="center"
          width="auto"
          height="auto"
          fontSize="30px"
          _hover={{ border: "1px solid red" }}
          onClick={() => deleteDog(dog._id)}
        >
          X
        </Button>
      </Box>
    </Box>
  );
};

export default Card;
