import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Field,
  Input,
  Grid,
  Box,
  Checkbox,
  Textarea,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";
import AutoSearch from "./components/newDog/AutoSearch";

const FormNewDog = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // handeling from data

  const [formData, setFormData] = useState({
    name: "",
    nick: "",
    age: "",
    bio: "",
    friends: [],
    isPresent: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
      errors.name = "Only letters, numbers, and spaces allowed.";
    }

    if (!formData.nick.trim()) {
      errors.nick = "Nickname is required.";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.nick)) {
      errors.nick = "Only letters, numbers, and spaces allowed.";
    }

    if (!formData.age.trim()) {
      errors.nick = "Age is required.";
    } else if (!/^\d+$/.test(formData.age)) {
      errors.age = "Only numbers allowed.";
    }

    if (!formData.bio.trim()) {
      errors.bio = "Bio is required.";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.bio)) {
      errors.bio = "Only letters, numbers, and spaces allowed.";
    }

    if (!formData.image) {
      console.log(formData.image);
      errors.image = "Image is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSetFriends = (newFriends) => {
    setFormData((prev) => ({ ...prev, friends: newFriends }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("formdata", formData);
      try {
        const res = await axios.post("http://localhost:3000/dogs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Success:", res.data);
        setSuccessMessage("Dog saved successfully! 🎉");
        // Reset form
        setFormData({
          name: "",
          nick: "",
          age: "",
          bio: "",
          friends: [],
          isPresent: "",
          image: null,
        });
        setSelectedImage(null);
        setPreviewUrl(null);
      } catch (err) {
        console.log("Error:", err);
      }
    } else {
      console.log("check validation");
    }
  };

  // end submission

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create a temporary URL for previewing the image
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  return (
    <div className="newDogContainer">
      <form onSubmit={handleSubmit}>
        <Grid
          templateColumns={["1fr", "1fr", "1fr 4fr 1fr"]}
          gap={6}
          my={5}
          width="1000px"
          maxW="80%"
          mx="auto"
        >
          <Box>
            {previewUrl && (
              <>
                <Text>Preview:</Text>
                <Image
                  p={3}
                  objectFit="cover"
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                />
              </>
            )}
            <Field.Root orientation="horizontal">
              <Input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
              />
            </Field.Root>
            {errors.image && (
              <Text color="red.500" fontSize="sm">
                {errors.image}
              </Text>
            )}

            <Checkbox.Root mt={4} onChange={handleChange} name="isPresent">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Present</Checkbox.Label>
            </Checkbox.Root>
          </Box>
          <Box>
            <Field.Root orientation="horizontal">
              <Field.Label>Name</Field.Label>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <Input
                  placeholder="John Doe"
                  name="name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm">
                    {errors.name}
                  </Text>
                )}
              </Box>
            </Field.Root>

            <Field.Root orientation="horizontal">
              <Field.Label>Nick name</Field.Label>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <Input
                  placeholder="@Doe"
                  name="nick"
                  id="nick"
                  type="text"
                  value={formData.nick}
                  onChange={handleChange}
                />
                {errors.nick && (
                  <Text color="red.500" fontSize="sm">
                    {errors.nick}
                  </Text>
                )}
              </Box>
            </Field.Root>
            <Field.Root orientation="horizontal">
              <Field.Label>Age</Field.Label>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <Input
                  placeholder="2"
                  name="age"
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
                {errors.age && (
                  <Text color="red.500" fontSize="sm">
                    {errors.age}
                  </Text>
                )}
              </Box>
            </Field.Root>
            <Field.Root orientation="horizontal">
              <Field.Label>Bio</Field.Label>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <Textarea
                  placeholder="Tell us a bit about yourself..."
                  name="bio"
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
                {errors.bio && (
                  <Text color="red.500" fontSize="sm">
                    {errors.bio}
                  </Text>
                )}
              </Box>
            </Field.Root>
            <Field.Root orientation="horizontal">
              <Field.Label>Friends</Field.Label>
              <AutoSearch setFriends={handleSetFriends} />
            </Field.Root>
            <Field.Root orientation="horizontal">
              <Field.Label></Field.Label>
              <Button
                mt={5}
                id="save-dog"
                type="submit"
                backgroundColor="teal.500"
                size="lg"
                mb={6}
                m={2}
              >
                Save
              </Button>
            </Field.Root>
            {successMessage && (
              <Text color="green.500" fontWeight="bold" mt={4}>
                {successMessage}
              </Text>
            )}
          </Box>
          <Box>
            <Link to="/">
              <Button backgroundColor="teal.500" size="lg" mb={6} m={2}>
                Go to dog list
              </Button>
            </Link>
          </Box>
        </Grid>
      </form>
    </div>
  );
};

function PageNewDog() {
  return (
    <>
      <FormNewDog />
    </>
  );
}

export default PageNewDog;
