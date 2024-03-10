export function getItemFromLocalStorage(thisLocal: string) {
  const stringify: string | null = localStorage.getItem(thisLocal);
  if (stringify) {
    const parsed = JSON.parse(stringify);
    return parsed;
  } else {
    return null;
  }
}

/* export function setItemInLocalStorage(thisLocal: string, newData: any) {
  localStorage.setItem(thisLocal, newData);
}
 */
