import { setDoc } from "firebase/firestore";
import { checkDB } from "./db";

async function sendToUsers(data: any, userId: string) {
  const { ref, snapShot } = await checkDB("users", userId);

  const userData = snapShot.data();
  if (!userData) {
    console.log("no user found in db");
    return false;
  }
  const updatedData = {
    ...userData,
    ...data,
  };

  await setDoc(ref, updatedData);
  return "user est mis a jour";
}

export { sendToUsers };
