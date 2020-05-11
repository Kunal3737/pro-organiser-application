import React, { useState, useEffect } from "react";
import Axios from "axios";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import "../Cards/Cards.css";
import Modal from "react-modal";

Modal.setAppElement("#root");
function Cards(props) {
  const { match, location, history } = props;
  console.log("Match: ", match.params.name);
  console.log("Location: ", location);
  console.log("History: ", history);
  console.log("Initials", props.members);
  console.log(props.id);

  const [ColumnId, setColumnId] = useState(props.id);
  const [ParamsId, setParamsId] = useState(props.paramsId);
  const [myCards, setmyCards] = useState({});
  const [cardDetailModal, setCardDetailModal] = useState(false);
  const [cardIdForCardDetail, setCardIdForCardDetail] = useState("");

  useEffect(() => {
    Axios.get(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${ParamsId}/column/${ColumnId}/cards.json`
    ).then((response) => {
      console.log("Cards Response: ", response.data);
      setmyCards(response.data);
    });
  }, [props.name]);

  const cardClickHandler = (cardId) => {
    setCardDetailModal(true);
    setCardIdForCardDetail(cardId);
  };

  return (
    <div>
      {myCards &&
        Object.entries(myCards).map((item) => (
          // console.log(item)
          <div
            key={item[0]}
            className="cardsInternal"
            onClick={(cardId) => {
              cardClickHandler(item[0]);
            }}
          >
            <div>{item[1].title}</div>
            <FontAwesomeIcon icon={faList} />
            <span className="initialsWrapper">
              {myCards && item[1].Members.map((items) => (
                <span key={items} className="initials">
                  {myCards && items
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </span>
              ))}
            </span>
          </div>
        ))}

      {Object.entries(myCards).map((item) =>
      // console.log(item[1].Due_Date)
        item[0] == cardIdForCardDetail ? (
          <Modal isOpen={cardDetailModal}>
            <div className="headerContainer">
              <span>
                <h1>{item[1].title}</h1>
                <h3>in {match.params.name}</h3>
              </span>
              <span>
                <button className="editCardDetail">Edit</button>
                <button className="archiveCardDetail">Archive</button>
              </span>
            </div>
            <hr />
            <h1>Description</h1>
            <div>{item[1].Description}</div>
            <h1>Members</h1>
            <div>
              {item[1].Members.map((items) => (
                <span key={items} className="initials">
                  {items
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </span>
              ))}
            </div>
            <h1>Due Date</h1>
            <div> {item[1].Due_Date} </div>
            <br />
            <button
              className="closeCardDetailModal"
              onClick={() => {
                setCardDetailModal(false);
              }}
            >
              Close
            </button>
          </Modal>
        ) : (
          <></>
        )
      )}
    </div>
  );
}

export default withRouter(Cards);
