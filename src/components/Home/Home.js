import React from "react";
// import "../Home/Home.css";
import styles from "../Home/Home.module.css";
// import Axios from 'axios';
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
const axios = require("axios").default;

function Home() {
  const [IsBlank, setIsBlank] = useState(false);
  const [myboard, setmyboard] = useState([]);
  const history = useHistory();
  const location = useLocation();
  // const [porp, setporp] = useState(location.state);

  useEffect(() => {
    axios
      .get(`https://pro-organizer-app-659cb.firebaseio.com/boards.json`)
      .then((response) => {
        if (response.data === null) {
          setIsBlank(true);
        }

        // console.log("Response", response.data);

        const fetchedResult = [];
        for (let key in response.data) {
          fetchedResult.push({
            ...response.data[key],
            id: key,
          });
        }
        setmyboard(fetchedResult);
      });
  }, [location.state]);

  if (IsBlank) {
    return (
      <p className={styles.noBoard}>
        <p>
          You haven't created any boards. Kindly click on the 'Create Board'
          button in the navigation bar to create a board.
        </p>
      </p>
    );
  }

  if (!IsBlank) {
    return (
      <div>
        <div>
          <>
            {myboard.map((items) => (
              <div
                className={styles.displayedBoards}
                key={items.id}
                onClick={() => {
                  history.push(`/${items.id}/${items.name}`);
                  // console.log("Item ID",items.id);
                }}
              >
                <strong> {items.name} </strong>
              </div>
            ))}
          </>
        </div>
      </div>
    );
  }
}

export default Home;
