import React, { useState } from "react";
import "./today.css";

interface TodayProps {
  list: ListItem;
  handleRemoveTaskFromTodayList: any;
}
interface ListItem {
  id: string;
  count: number;
  name: string;
  unit: string;
  description: string;
  details: string;
}
const Today: React.FC<TodayProps> = ({
  list,
  handleRemoveTaskFromTodayList,
}) => {
  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  return (
    <div className="today-list">
      <h2>today's list</h2>
      <ul>
        {Object.values(list).map((item, index) => {
          // Si la clé est "date", on ne l'affiche pas
          if (typeof item === "string") {
            return null;
          }
          return (
            <li key={item.id} className="item">
              <div className="title-count">
                <h3>{item.name}</h3>{" "}
                <p className="count">
                  {item.unit === false ? (
                    <button
                      onClick={() => {
                        console.log("switch a true");
                      }}
                    >
                      Done ?
                    </button>
                  ) : (
                    <>
                      {item.unit === true ? (
                        <button
                          onClick={() => {
                            console.log("switch a FALSE");
                          }}
                        >
                          done !
                        </button>
                      ) : (
                        <>
                          <input
                            type="number"
                            name="count"
                            id="count"
                            placeholder={item.count}
                          />
                          {item.unit}
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
              <div className="description-button">
                <p>{item.description}</p>
                <button
                  onClick={() => {
                    setClickedIndex((prevIndex) =>
                      prevIndex === index ? null : index
                    );
                  }}
                >
                  {">"}
                </button>
              </div>

              <p className={clickedIndex === index ? "active" : "hidden"}>
                <strong>Details:</strong> {item.details}{" "}
                <span
                  className="remove"
                  onClick={() => {
                    // remove de la list de la props ...
                    handleRemoveTaskFromTodayList(item.id);
                  }}
                >
                  remove
                </span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Today;
