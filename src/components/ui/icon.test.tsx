import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Icon from "./Icon";

test("renders Icon with the correct src and alt", () => {
  const { getByAltText } = render(
    <Icon nameImg="test-icon" onClick={() => {}} />
  );
  const iconElement = getByAltText("test-icon");

  expect(iconElement).toBeInTheDocument();
  expect(iconElement).toHaveAttribute("src", "/icon/test-icon.png");
  expect(iconElement).toHaveAttribute("alt", "test-icon");
});

test("applies the className prop correctly", () => {
  const { getByAltText } = render(
    <Icon nameImg="test-icon" onClick={() => {}} />
  );
  const iconElement = getByAltText("test-icon");

  expect(iconElement).toHaveClass("icon");
  expect(iconElement).toHaveClass("test-icon");
});

test("calls onClick prop when clicked", () => {
  const handleClick = jest.fn();
  const { getByAltText } = render(
    <Icon nameImg="test-icon" onClick={handleClick} />
  );
  const iconElement = getByAltText("test-icon");

  fireEvent.click(iconElement);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
