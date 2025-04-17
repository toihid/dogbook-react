import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PageProfile from "./PageProfile"; // Adjust the import as per your file structure
import { Provider } from "../src/components/ui/provider";
// Mock axios
jest.mock("axios");

test("It should render dog profile correctly with friends", async () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const mockDog = {
    _id: "1",
    name: "Rex",
    nick: "The Rocket",
    bio: "Cool dog",
    image: "rex.png",
    friends: [
      { _id: "2", name: "Max" },
      { _id: "3", name: "Bella" },
    ],
  };

  // Mock axios to return the mock dog data
  axios.get.mockResolvedValue({ data: mockDog });

  render(
    <MemoryRouter initialEntries={["/profile/1"]}>
      <Provider>
        <Routes>
          <Route path="/profile/:id" element={<PageProfile />} />
        </Routes>
      </Provider>
    </MemoryRouter>
  );

  // Check if the dog name is rendered
  const name = await screen.findByText("Rex");
  expect(name).toBeInTheDocument();

  // Check if the dog bio is rendered
  const bio = screen.getByText("Cool dog");
  expect(bio).toBeInTheDocument();

  // Check if the 'Go to dog list' button is rendered
  const goToListButton = screen.getByRole("link", { name: /Go to dog list/i });
  expect(goToListButton).toBeInTheDocument();

  // Check if the 'Edit Profile' button is rendered
  const editButton = screen.getByRole("link", { name: /Edit Profile/i });
  expect(editButton).toBeInTheDocument();

  // Check if the friends' names are rendered within Link elements
  const friend1 = screen.getByText("Max");
  const friend2 = screen.getByText("Bella");
  expect(friend1).toBeInTheDocument();
  expect(friend2).toBeInTheDocument();

  // You can also check for the avatar image to confirm the friend is rendered correctly
  const avatarImage = screen.getByAltText("Rex");
  expect(avatarImage).toBeInTheDocument();
});
