import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import PageHome from "./PageHome";
import { Provider } from "../src/components/ui/provider";

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

test("It should render 'Meet the dogs'", async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(
    <MemoryRouter>
      <Provider>
        <PageHome />
      </Provider>
    </MemoryRouter>
  );

  const heading = await screen.findByText("Meet the dogs");
  expect(heading).toBeInTheDocument();
});
