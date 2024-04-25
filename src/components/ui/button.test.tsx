import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders Button with the correct text", () => {
  const { getByText } = render(
    <Button value="Test Button" onClick={jest.fn()} />
  );
  const buttonElement = getByText(/Test Button/i);
  expect(buttonElement).toBeInTheDocument();
});

test("calls onClick prop when clicked", () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button value="Test Button" onClick={handleClick} />
  );
  const buttonElement = getByText(/Test Button/i);

  fireEvent.click(buttonElement);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
test("applies the type prop correctly", () => {
  const { getByText } = render(
    <Button value="Test Button" onClick={jest.fn()} type="submit" />
  );
  const buttonElement = getByText(/Test Button/i) as HTMLButtonElement;

  expect(buttonElement.type).toBe("submit");
});

test("applies the className prop correctly", () => {
  const { getByText } = render(
    <Button value="Test Button" onClick={jest.fn()} className="test-class" />
  );
  const buttonElement = getByText(/Test Button/i);

  expect(buttonElement).toHaveClass("test-class");
});
