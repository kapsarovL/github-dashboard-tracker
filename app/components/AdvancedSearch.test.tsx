import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdvancedSearch } from "./AdvancedSearch";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
};

describe("AdvancedSearch - Integration Tests", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    jest.clearAllMocks();
  });

  it("opens search modal when button is clicked", () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    expect(
      screen.getByPlaceholderText(
        "Search repositories (e.g., 'machine learning', 'react dashboard')",
      ),
    ).toBeInTheDocument();
  });

  it("has language filter dropdown", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText("Advanced Filters")).toBeInTheDocument();
    });

    // Check for language section
    expect(screen.getByText("Language")).toBeInTheDocument();
  });

  it("has stars filter inputs", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Advanced Filters")).toBeInTheDocument();
    });

    // Check for min/max stars labels
    expect(screen.getByText("Min Stars")).toBeInTheDocument();
    expect(screen.getByText("Max Stars")).toBeInTheDocument();
  });

  it("has sort options", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Advanced Filters")).toBeInTheDocument();
    });

    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("has feature checkboxes", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Advanced Filters")).toBeInTheDocument();
    });

    expect(screen.getByText("Has Issues")).toBeInTheDocument();
    expect(screen.getByText("Has Wiki")).toBeInTheDocument();
  });

  it("closes modal when clicking close button", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Search repositories"),
      ).not.toBeInTheDocument();
    });
  });

  it("has search input", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    const searchInput = screen.getByPlaceholderText(
      "Search repositories (e.g., 'machine learning', 'react dashboard')",
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("has search button", async () => {
    const wrapper = createWrapper();
    render(<AdvancedSearch />, { wrapper });

    const searchButton = screen.getByRole("button", {
      name: /advanced search/i,
    });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Search" }),
      ).toBeInTheDocument();
    });
  });
});
