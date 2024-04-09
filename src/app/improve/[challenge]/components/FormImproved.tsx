import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { modifyChall } from "@/firebase/db/chall";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { useContext, useEffect, useState } from "react";

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
  const dateToday = new Date().toISOString();
  const [message, setMessage] = useState<string | null>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      const actualChall = getItemFromLocalStorage("customChall");
      if (actualChall[thisChall.id].perf) {
        console.log(" in today perf of this chall");

        for (const date of Object.keys(actualChall[thisChall.id].perf)) {
          if (date === new Date().toISOString().slice(0, 10)) {
            const confirmReplace = window.confirm(
              "You have already submitted your improvement for today. Do you want to replace it?"
            );
            if (confirmReplace) {
              // If user confirms, proceed with replacing the previous data
              // You can continue your logic here to replace the previous data
              setMessage("Your improvement for today will be replaced.");
              console.log("Your improvement for today will be replaced.");
            }
            if (!confirmReplace) {
              console.log("canceled.");
              return;
            }
          }
        }
      }
      submitModify(improvements);
    } catch (error) {
      console.log(improvements);
      console.error(error);
    }
  };
  async function submitModify(data: any) {
    let perf = {
      ...thisChall.perf,
      [dateToday.slice(0, 10)]: {
        ...data,
        date: dateToday,
      },
    };
    console.log("historic", perf);
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) {
        data[key] = "";
      }
    });
    const datatosend = {
      ...thisChall,
      perf,
    };
    console.log("datatosend", datatosend);
    // send to db
    await modifyChall(datatosend, user.uid);
    setMessage("Your improvement has been saved !");

    setTimeout(() => {
      window.location.href = "/improve";
    }, 2000);
  }

  return (
    <>
      <h3>{dateToday.slice(0, 10)}</h3>
      <form className="container-improvements" onSubmit={handleSubmit}>
        {thisChall.selectedImprovement &&
          thisChall.selectedImprovement.map(
            (improvement: string, index: number) => (
              <div key={index} className="improvement">
                <label>{improvement}:</label>
                <input
                  type="text"
                  value={improvements[improvement] || ""}
                  placeholder={improvements[improvement]}
                  onChange={(e) =>
                    handleInputChange(improvement, e.target.value)
                  }
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
    </>
  );
};

export default FormImproved;
