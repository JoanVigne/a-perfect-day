export function getItemFromLocalStorage(thisLocal: string) {
  const stringify: string | null = localStorage.getItem(thisLocal);
  if (stringify) {
    const parsed = JSON.parse(stringify);
    return parsed;
  } else {
    return null;
  }
}
