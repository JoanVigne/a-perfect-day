export const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
  const inputElement = event.target;
  const offset = 170;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elemRect = inputElement.getBoundingClientRect().top;
  const offsetPosition = elemRect - bodyRect - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};
