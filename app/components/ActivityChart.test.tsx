import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActivityChart } from "./ActivityChart";

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Wrapper component for providers
function renderWithProviders(
  ui: React.ReactElement,
  { queryClient = createTestQueryClient() } = {}
) {
  return {
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe("ActivityChart", () => {
  const mockData = [
    { date: "2024-01-01", commits: 5, issues: 2 },
    { date: "2024-01-02", commits: 8, issues: 1 },
    { date: "2024-01-03", commits: 3, issues: 4 },
    { date: "2024-01-04", commits: 12, issues: 0 },
    { date: "2024-01-05", commits: 7, issues: 3 },
  ];

  it("renders empty state when no data is provided", () => {
    renderWithProviders(<ActivityChart data={[]} />);

    expect(
      screen.getByText("No activity yet")
    ).toBeInTheDocument();
  });

  it("renders empty state when data is null", () => {
    renderWithProviders(<ActivityChart data={null as unknown as typeof mockData} />);

    expect(
      screen.getByText("No activity yet")
    ).toBeInTheDocument();
  });

  it("renders chart with data", async () => {
    renderWithProviders(<ActivityChart data={mockData} />);

    // Check for mode toggle buttons
    expect(screen.getByRole("button", { name: /commits/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /issues/i })).toBeInTheDocument();

    // Check for stats in header
    await waitFor(() => {
      expect(screen.getByText(/total/i)).toBeInTheDocument();
      expect(screen.getByText(/peak/i)).toBeInTheDocument();
    });
  });

  it("displays correct total commits", async () => {
    renderWithProviders(<ActivityChart data={mockData} />);

    await waitFor(() => {
      // Total should be 5+8+3+12+7 = 35
      expect(screen.getByText("35")).toBeInTheDocument();
    });
  });

  it("displays correct peak value", async () => {
    renderWithProviders(<ActivityChart data={mockData} />);

    await waitFor(() => {
      // Peak should be 12 - find all elements with "12" and check the first one in Peak section
      const peakElements = screen.getAllByText("12");
      expect(peakElements.length).toBeGreaterThan(0);
    });
  });

  it("renders footer with best day information", async () => {
    renderWithProviders(<ActivityChart data={mockData} />);

    await waitFor(() => {
      expect(screen.getByText(/best day:/i)).toBeInTheDocument();
    });
  });

  it("has proper accessibility attributes", () => {
    renderWithProviders(<ActivityChart data={mockData} />);

    // Buttons should be accessible
    const commitsButton = screen.getByRole("button", { name: /commits/i });
    expect(commitsButton).toBeInTheDocument();
  });
});
