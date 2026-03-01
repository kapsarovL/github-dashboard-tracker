import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RepoSelector } from "./RepoSelector";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

import { useRouter } from "next/navigation";

describe("RepoSelector", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("renders search input with placeholder", () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL");
    expect(input).toBeInTheDocument();
  });

  it("renders explore button", () => {
    render(<RepoSelector />);

    expect(screen.getByRole("button", { name: /explore/i })).toBeInTheDocument();
  });

  it("disables explore button when input is empty", () => {
    render(<RepoSelector />);

    const exploreButton = screen.getByRole("button", { name: /explore/i });
    expect(exploreButton).toBeDisabled();
  });

  it("enables explore button when input has value", () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL");
    fireEvent.change(input, { target: { value: "facebook/react" } });

    const exploreButton = screen.getByRole("button", { name: /explore/i });
    expect(exploreButton).not.toBeDisabled();
  });

  it("navigates to repo page on form submit", async () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL");
    fireEvent.change(input, { target: { value: "facebook/react" } });

    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/?repo=facebook%2Freact");
    });
  });

  it("shows error for invalid repo format", async () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL");
    fireEvent.change(input, { target: { value: "invalid" } });

    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/use format:/i)).toBeInTheDocument();
    });
  });

  it("clears error when input is cleared", async () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL");

    // Trigger error
    fireEvent.change(input, { target: { value: "invalid" } });
    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/use format:/i)).toBeInTheDocument();
    });

    // Clear input
    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.queryByText(/use format:/i)).not.toBeInTheDocument();
    });
  });

  it("clears error when valid format is entered", async () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL");

    // Trigger error
    fireEvent.change(input, { target: { value: "invalid" } });
    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/use format:/i)).toBeInTheDocument();
    });

    // Enter valid format
    fireEvent.change(input, { target: { value: "owner/repo" } });

    await waitFor(() => {
      expect(screen.queryByText(/use format:/i)).not.toBeInTheDocument();
    });
  });

  it("has search icon", () => {
    render(<RepoSelector />);

    // Search SVG icon should be present in the document
    const allSvgs = document.querySelectorAll("svg");
    expect(allSvgs.length).toBeGreaterThan(0);
  });

  it("clears input after successful navigation", async () => {
    render(<RepoSelector />);

    const input = screen.getByPlaceholderText("owner/repo or GitHub URL") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "facebook/react" } });

    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    // Input should be cleared after navigation
    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });
});
