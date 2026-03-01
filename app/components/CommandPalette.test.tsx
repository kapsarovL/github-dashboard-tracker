import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommandPalette } from "./CommandPalette";

describe("CommandPalette", () => {
  it("does not render when closed", () => {
    render(<CommandPalette isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(<CommandPalette isOpen={true} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type a command or search...")
    ).toBeInTheDocument();
  });

  it("closes when clicking X button", () => {
    const onClose = jest.fn();
    render(<CommandPalette isOpen={true} onClose={onClose} />);

    // Find the close button by aria-label or position
    const closeButton = screen.getAllByRole("button")[0];
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("filters items based on search query", async () => {
    const onClose = jest.fn();
    render(<CommandPalette isOpen={true} onClose={onClose} />);

    const searchInput = screen.getByPlaceholderText(
      "Type a command or search..."
    );

    fireEvent.change(searchInput, { target: { value: "analytics" } });

    await waitFor(() => {
      expect(screen.getByText("Go to Analytics")).toBeInTheDocument();
    });
  });

  it("shows no results message when no matches found", async () => {
    const onClose = jest.fn();
    render(<CommandPalette isOpen={true} onClose={onClose} />);

    const searchInput = screen.getByPlaceholderText(
      "Type a command or search..."
    );

    fireEvent.change(searchInput, { target: { value: "xyz123notfound" } });

    await waitFor(() => {
      expect(screen.getByText(/No commands found for/i)).toBeInTheDocument();
    });
  });
});
