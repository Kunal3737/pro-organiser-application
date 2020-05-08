import React, { useState, useEffect } from "react";
import Axios from "axios";
import {withRouter} from 'react-router';

function Cards(props) {
  const { match, location, history } = props;
  console.log("Match: ",match);
  console.log("Location: ",location);
  console.log("History: ",history);

  console.log("Props", props);
  const [CardsId, setCardsId] = useState(props.id);
  const [ParamsId, setParamsId] = useState(props.paramsId);
  const [myCards, setmyCards] = useState([]);

  useEffect(() => {
    Axios.get(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${ParamsId}/column/${CardsId}/cards.json`
    ).then((response) => {
      console.log("Cards Response: ", response.data);
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
          <div key={item.id} className="cards">
            <div>{item.title}</div>
            <div>{item.description}</div>
            <div>{item.dueDate}</div>
          </div>
        ))}
    </div>
  );
}

export default withRouter(Cards);
