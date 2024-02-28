export default function resetListToFalseAndZero(data: any) {
  console.log("today list reseted");
  const todayDate = new Date().toISOString();
  let copyData = JSON.parse(JSON.stringify(data));
  Object.keys(copyData).forEach((key) => {
    const ele = copyData[key];
    if (typeof ele.unit === "boolean") {
      copyData[key].unit = false;
    }
    if (typeof ele.unit === "string" || typeof ele.unit === "number") {
      copyData[key].count = "0";
    }
  });
  copyData.date = todayDate;
  return copyData;
}
