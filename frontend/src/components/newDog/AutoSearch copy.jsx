import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Autosearch({ setFriends }) {
  const [query, setQuery] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [dogNames, setDogNames] = useState([]);

  const suggestions = [
    "67ecfa001c5efb6a87d82183",
    "67ecfd482041881306748e78",
    "Beagle",
    "Husky",
    "Bulldog",
  ];

  const suggestions2 = [
    { id: "67ecfa001c5efb6a87d82183", name: "test1" },
    { id: "67f3b685ddec9a5b3c51cdca", name: "test2" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/dogs");
        const allDogs = res.data;
        setDogs(allDogs);
        const allNames = allDogs.map((item) => item.name);
        setDogNames(allNames);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const getDogIds = (dogNames) => {
    const matchedIds = dogs
      .filter((item) => dogNames.includes(item.name.trim()))
      .map((item) => item._id);
    return matchedIds;
  };

  const handleChanges = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setMatches([]);
      return;
    }
    const filtered = dogNames.filter(
      (item) =>
        item.toLowerCase().includes(value.toLowerCase()) &&
        !selected.includes(item)
    );
    setMatches(filtered);
  };

  const handleSelect = (item) => {
    const updatedSelected = [...selected, item];

    setSelected(updatedSelected);
    //  needs json stringify for "Content-Type": "multipart/form-data",
    setFriends(JSON.stringify(getDogIds(updatedSelected)));
    setQuery(item);
    setMatches([]);
  };

  const handleDeleteFriend = (toRemoveItem) => {
    const updatedFriends = selected.filter((item) => {
      return item !== toRemoveItem;
    });

    setSelected(updatedFriends);
    setFriends(updatedFriends);
  };

  return (
    <>
      <VStack align="start" spacing={0} w="100%" gap={0}>
        <Input
          placeholder="Searching...."
          value={query}
          onChange={handleChanges}
          boxShadow="sm"
          my={4}
          _focus={{ borderColor: "blue.400", boxShadow: "md" }}
        />

        {matches.map((item, key) => (
          <Box
            key={key}
            width="100%"
            boxShadow="sm"
            px={3}
            py={2}
            border="1px solid #e4e4e7"
            _hover={{ bg: "gray", cursor: "pointer" }}
            onClick={() => handleSelect(item)}
          >
            <Text>{item}</Text>
          </Box>
        ))}

        {selected.length > 0 && (
          <>
            <Text my={5} fontWeight="bold">
              Selected Friends
            </Text>
            {selected.map((item, key) => (
              <Box
                key={key}
                width="100%"
                boxShadow="sm"
                px={3}
                py={1}
                border="1px solid #e4e4e7"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
              >
                <Text key={key}>
                  {item}
                  <Button
                    background="none"
                    me={5}
                    color="red"
                    pe={0}
                    fontWeight="bolder"
                    onClick={() => handleDeleteFriend(item)}
                  >
                    X
                  </Button>
                </Text>
              </Box>
            ))}
          </>
        )}
      </VStack>
    </>
  );
}

export default Autosearch;
