import { render, fireEvent, screen, within } from "@testing-library/react";
import App from "./App";
// Material UI example 2 test
// test("test AutoComplete selection", () => {
//   render(<App />);
//   const autocomplete = screen.getByTestId("autocomplete");
//   const input = within(autocomplete).getByLabelText("available fruits");
//   fireEvent.click(input); // sets focus
//   fireEvent.change(input, { target: { value: "Blackberry" } });
//   fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
//   fireEvent.keyDown(autocomplete, { key: "Enter" });
//   expect(screen.getByText("You selected Blackberry")).toBeInTheDocument();
//   // this just shows what the test sees, comment it out if there are no problems
//   // screen.debug();
// });

// Lab 12 test
test("test AutoComplete selection", () => {
  render(<App />);
  const autocomplete = screen.getByTestId("autocomplete");
  const input = within(autocomplete).getByLabelText("pick a word");
  fireEvent.click(input); // sets focus
  fireEvent.change(input, { target: { value: "Here" } });
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(autocomplete, { key: "Enter" });
  expect(screen.getByText("Here")).toBeInTheDocument();
  // this just shows what the test sees, comment it out if there are no problems
  // screen.debug();
});