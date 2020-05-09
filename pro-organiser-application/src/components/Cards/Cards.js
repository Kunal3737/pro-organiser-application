import React, { useState, useEffect } from "react";
import Axios from "axios";
import {withRouter} from 'react-router';

function Cards(props) {
  const { match, location, history } = props;
  console.log("Match: ",match);
  console.log("Location: ",location);
  console.log("History: ",history);

  console.log("Props", props);
  const [ColumnId, setColumnId] = useState(props.id);
  console.log(props.id);
  const [ParamsId, setParamsId] = useState(props.paramsId);
  const [myCards, setmyCards] = useState({});

  useEffect(() => {
    Axios.get(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${ParamsId}/column/${ColumnId}/cards.json`
    ).then((response) => {
      console.log("Cards Response: ", response.data);
      setmyCards(response.data);
      console.log(myCards);
    });
  }, [props.name]);

  return (
    <div>
      {myCards &&
        Object.entries(myCards).map((item) => (
          <div key={item[0]} className="cards">
            <div>{item[1].title}</div>
          </div>
        ))}
    </div>
  );
}

export default withRouter(Cards);


/* const fetchedData = [];
      for (let key in response.data) {
        fetchedData.push({
          ...response.data[key],
          id: key,
        });
      }
      console.log("Cards Data: ", fetchedData);
                  <div>{item.description}</div>
            <div>{item.dueDate}</div>
 */