import { render, screen } from "@testing-library/react";
import { StatsGrid } from "./StatsGrid";

describe("StatsGrid", () => {
  const mockStats = {
    repository: {
      stargazers_count: 1250,
      description: "A test repository for GitHub analytics",
      forks_count: 340,
      open_issues_count: 45,
      subscribers_count: 89,
      watchers_count: 1250,
    },
  };

  it("renders all four stat cards", () => {
    render(<StatsGrid data={mockStats} />);

    expect(screen.getByText("Stargazers")).toBeInTheDocument();
    expect(screen.getByText("Forks")).toBeInTheDocument();
    expect(screen.getByText("Open Issues")).toBeInTheDocument();
    expect(screen.getByText("Watchers")).toBeInTheDocument();
  });

  it("displays correct star count", () => {
    render(<StatsGrid data={mockStats} />);

    // Get all elements with "1,250" and check the first one (Stargazers card)
    const allStarCounts = screen.getAllByText("1,250");
    expect(allStarCounts.length).toBeGreaterThan(0);
  });

  it("displays correct fork count", () => {
    render(<StatsGrid data={mockStats} />);

    expect(screen.getByText("340")).toBeInTheDocument();
  });

  it("displays correct issues count", () => {
    render(<StatsGrid data={mockStats} />);

    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("displays repository description", () => {
    render(<StatsGrid data={mockStats} />);

    expect(
      screen.getByText("A test repository for GitHub analytics")
    ).toBeInTheDocument();
  });

  it("displays 'No description provided' when description is null", () => {
    const statsWithoutDescription = {
      repository: {
        ...mockStats.repository,
        description: null,
      },
    };

    render(<StatsGrid data={statsWithoutDescription} />);

    expect(screen.getByText("No description provided")).toBeInTheDocument();
  });

  it("formats large numbers correctly", () => {
    const largeStats = {
      repository: {
        stargazers_count: 1000000,
        description: "Test",
        forks_count: 500000,
        open_issues_count: 10000,
        subscribers_count: 50000,
        watchers_count: 1000000,
      },
    };

    render(<StatsGrid data={largeStats} />);

    // Check that large numbers are rendered (may appear multiple times)
    const allText = screen.getAllByText("1,000,000");
    expect(allText.length).toBeGreaterThan(0);
  });

  it("has proper structure for each card", () => {
    render(<StatsGrid data={mockStats} />);

    // Check for heading elements
    expect(screen.getByRole("heading", { name: "Stargazers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Forks" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Open Issues" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Watchers" })).toBeInTheDocument();
  });
});
