import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Card from "../components/card";
//import { Provider } from "../src/components/ui/provider";
import { Provider } from "./ui/provider";

// Mock axios
jest.mock("axios");

// Mock matchMedia (for Chakra UI or any responsive library)
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

test("It should render 'Name:'", async () => {
  axios.get.mockResolvedValue({ data: [] });

  const mockDog = {
    _id: "1",
    name: "Rex",
    nick: "The Rocket",
    age: 3,
    bio: "Cool dog",
    image: "rex.png",
    friends: [],
    isPresent: true,
  };

  render(
    <MemoryRouter>
      <Provider>
        <Card dog={mockDog} />
      </Provider>
    </MemoryRouter>
  );

  const heading = await screen.findByText("Name:");
  expect(heading).toBeInTheDocument();

  // Actual dog values
  expect(await screen.findByText("Rex")).toBeInTheDocument();
  expect(await screen.findByText("The Rocket")).toBeInTheDocument();
  expect(await screen.findByText("3")).toBeInTheDocument();
  expect(await screen.findByText("Yes")).toBeInTheDocument(); // because isPresent is true
});
