import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { modifyChall } from "@/firebase/db/chall";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import React, { useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
interface UserData {
  email: string;
  uid: string;
}
interface Props {
  thisChall: { [shortDate: string]: any };
}

/* CALENDAR + FORM CHANGE PAST DAYS */
const CalendarChall: React.FC<Props> = ({ thisChall }) => {
  // calendar :
  const [value, onChange] = useState<Value>(new Date());
  //
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const dayClick = (value: Date) => {
    const selectedDate = value.toISOString().split("T")[0];
    const todayDate = new Date().toISOString().split("T")[0];
    if (selectedDate === todayDate) {
      setMessage("You can change today perfs in the previous section.");
      return;
    }
    if (selectedDate > todayDate) {
      setMessage("cannot change the futur !");
      return;
    }

    const formattedDate = value.toISOString().split("T")[0];
    /*     window.location.href = `/improve/${formattedDate}`; */
    setModal(true);
    setSelectedDate(formattedDate);
    console.log(formattedDate);
  };
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
      const actualChall = getItemFromLocalStorage("customChall");

      if (actualChall[thisChall.id].perf) {
        console.log(" in today perf of thus chall");

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
      [selectedDate.slice(0, 10)]: {
        ...data,
        date: selectedDate,
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
    <div>
      {modal && (
        <div>
          <h3>Modify the {selectedDate} ? </h3>
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
      )}

      <Calendar
        value={value}
        onChange={onChange}
        onClickDay={dayClick}
        tileClassName={({ date }) =>
          `${
            thisChall[date.toISOString().split("T")[0]] ? "has-thisChall" : ""
          } ${date.toISOString().split("T")[0] === todayDate ? "today" : ""}`
        }
      />
      <TemporaryMessage message={message} type="message-info" timeInMS={4000} />
    </div>
  );
};

export default CalendarChall;
