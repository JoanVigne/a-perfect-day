import { setDoc } from "firebase/firestore";
import { checkDB } from "./db";

async function sendToUsers(data: any, userId: string) {
  const { ref, snapShot } = await checkDB("users", userId);
  if (!snapShot.exists()) {
    // Traitez le cas où l'id du user n'existe pas
    await setDoc(ref, {});
  }
  const userData = snapShot.data();
  if (!userData) {
    return;
  }
  const updatedData = {
    ...userData,
    ...data,
  };
  console.log(updatedData);
  await setDoc(ref, updatedData);
  console.log("user est mis a jour");
}

export { sendToUsers };
