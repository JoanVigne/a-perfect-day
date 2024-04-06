import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { modifyChall } from "@/firebase/db/chall";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { use, useEffect, useState } from "react";

interface UserData {
  email: string;
  uid: string;
}
interface Props {
  thisChall: { [shortDate: string]: any };
  thisDay: string;
}
const FormModifyPreviousDays: React.FC<Props> = ({ thisChall, thisDay }) => {
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<{ [key: string]: string }>(
    thisChall.selectedImprovement.reduce(
      (acc: { [key: string]: string }, currentValue: string) => {
        acc[currentValue] = thisChall[currentValue];
        return acc;
      },
      {}
    )
  );
  useEffect(() => {
    console.log("thisChall", thisChall);
    console.log("thisDay", thisDay);
  }, []);
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
      const actualChall = getItemFromLocalStorage("customChall");

      if (actualChall[thisChall.id].perf) {
        console.log(" in today perf of thus chall");
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
      [thisDay.slice(0, 10)]: {
        ...data,
        date: thisDay,
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
    }, 2500);
  }
  return (
    <>
      <div>
        <h3>Modify the {thisDay.slice(0, 10)} ? </h3>
        <form className="container-improvements" onSubmit={handleSubmit}>
          {thisChall.selectedImprovement &&
            thisChall.selectedImprovement.map(
              (improvement: string, index: number) => (
                <div key={index} className="improvement">
                  <label>{improvement}:</label>
                  <input
                    type="text"
                    value={improvements[improvement]}
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
      </div>
    </>
  );
};

export default FormModifyPreviousDays;
