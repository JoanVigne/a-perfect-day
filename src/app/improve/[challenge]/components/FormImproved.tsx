import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { modifyChall } from "@/firebase/db/chall";
import React, { useContext, useState } from "react";

interface UserData {
  email: string;
  uid: string;
}
interface Props {
  thisChall: {
    selectedImprovement: string[];
    [key: string]: any;
  };
}

const FormImproved: React.FC<Props> = ({ thisChall }) => {
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState<string | null>("");
  const [improvements, setImprovements] = useState<{ [key: string]: string }>(
    thisChall.selectedImprovement.reduce(
      (acc: { [key: string]: string }, currentValue: string) => {
        acc[currentValue] = thisChall[currentValue];
        return acc;
      },
      {}
    )
  );

  const handleInputChange = (improvement: string, value: string) => {
    setImprovements({ ...improvements, [improvement]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Object.entries(thisChall).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }
        if (!isNaN(Number(value))) {
          Object.entries(improvements).forEach(([key, impValue]) => {
            if (
              impValue !== null &&
              impValue !== undefined &&
              isNaN(Number(impValue))
            ) {
              setMessage(
                `The value of ${key} was a number and you entered a letter !`
              );
              throw new Error("Invalid input");
            }
          });
        }
      });

      submitModify(improvements);
      console.log(improvements);
    } catch (error) {
      console.log(improvements);
      console.error(error);
    }
  };
  function submitModify(data: any) {
    console.log("data dans submitModify", data);
    // Convert undefined values to empty strings
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) {
        data[key] = "";
      }
    });
    const datatosend = {
      ...thisChall,
      ...data,
    };
    console.log("datatosend", datatosend);
    // control data
    // send to db
    modifyChall(datatosend, user.uid);
  }
  return (
    <form className="container-improvements" onSubmit={handleSubmit}>
      {thisChall.selectedImprovement &&
        thisChall.selectedImprovement.map(
          (improvement: string, index: number) => (
            <div key={index} className="improvement">
              <label>{improvement}:</label>
              <input
                type="text"
                value={improvements[improvement]}
                onChange={(e) => handleInputChange(improvement, e.target.value)}
              />
            </div>
          )
        )}
      <TemporaryMessage
        message={message}
        type="message-error"
        timeInMS={6000}
      />
      <input className="save" type="submit" value="Save my improvement" />
    </form>
  );
};

export default FormImproved;
