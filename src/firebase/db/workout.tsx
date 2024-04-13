import { doc, setDoc } from "firebase/firestore";
import { checkDB, db } from "./db";

interface Data {
  [key: string]: any;
}
/// const sendToExercices
const sendToWorkout = async (data: Data, userId: string) => {
  const { ref, snapShot } = await checkDB("workouts", userId);
  console.log("snapShot", snapShot);
  console.log("ref", ref);
  if (!snapShot.exists()) {
    // Traitez le cas où l'id du user n'existe pas
    console.log("no user id found");
    const workoutref = doc(db, "workouts", userId);
    await setDoc(workoutref, {});
    /*     await setDoc(ref, {}); */
  }
  const workoutData = snapShot.data();
  /*   if (!workoutData) {
    return;
  } */

  const updatedData = {
    ...workoutData,
    [data.id]: {
      ...data,
    },
  };
  console.log("updated data :", updatedData);
  await setDoc(ref, updatedData);
  localStorage.setItem("workouts", JSON.stringify(updatedData));
  console.log("workouts est mis a jour");
};
const removeFromCustom = async (data: any, userId: string) => {
  try {
    const { ref, snapShot } = await checkDB("custom", userId);
    if (!snapShot.exists()) {
      console.log("User ID not found in database");
      return "User ID not found in database";
    }
    const customData = snapShot.data();
    if (!customData) {
      console.log("Custom data not found in database");
      return "Custom data not found in database";
    }

    await setDoc(ref, data);
    localStorage.setItem("custom", JSON.stringify(data));
    return "Task removed";
  } catch (error) {
    console.error("Error removing custom task:", error);
    return "Error removing custom task";
  }
};
export { sendToWorkout, removeFromCustom };
