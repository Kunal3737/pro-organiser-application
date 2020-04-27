import React, { useState, useEffect } from "react";
import Axios from "axios";

function Cards(props) {
  console.log("Props", props);
  const [CardsId, setCardsId] = useState("");
  const [ParamsId, setParamsId] = useState("");
  const [myCards, setmyCards] = useState([]);

  useEffect(() => {
    setCardsId(props.id);
    setParamsId(props.paramsId);
    Axios.get(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${props.paramsId}/column/${props.id}/cards.json`
    ).then((response) => {
      console.log("Cards Response: ", response.data);
      console.log(myCards);
      const fetchedData = [];
      for (let key in response.data) {
        fetchedData.push({
          ...response.data[key],
          id: key,
        });
      }
      console.log("Cards Data: ", fetchedData);
      setmyCards(fetchedData);
    });
  }, [props.name]);

  return (
    <div>
      {myCards &&
        myCards.map((item) => (
          <div key={item.id}>
            <div>{item.title}</div>
          </div>
        ))}
    </div>
  );
}

export default Cards;
