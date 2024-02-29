import React, { useEffect } from "react";

interface Props {
  user: any | null;
}

const Lists: React.FC<Props> = ({ user }) => {
  useEffect(() => {
    console.log("dans lists", user);
  }, [user]);

  function listDetail(name: String) {
    console.log("list : ", user.lists[name]);
    Object.values(user.lists[name]).map((element) => {
      console.log("ele  : ", element.name);
    });

    // envoyer avec la date du jour !
  }
  return (
    <div className="container">
      <h2>Favorit Lists</h2>
      {user &&
        Object.keys(user.lists).map((listName: string) => {
          return (
            <React.Fragment key={listName}>
              <li>
                {listName}
                <button
                  onClick={() => {
                    listDetail(listName);
                  }}
                >
                  Use
                </button>
              </li>
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Lists;
