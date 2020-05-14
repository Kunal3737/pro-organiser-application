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
  console.log(props.allMembers);

  const [ColumnId, setColumnId] = useState(props.id);
  const [ParamsId, setParamsId] = useState(props.paramsId);
  const [myCards, setmyCards] = useState({});
  const [cardDetailModal, setCardDetailModal] = useState(false);
  const [cardIdForCardDetail, setCardIdForCardDetail] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editedTeamMembers, setEditedTeamMembers] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [changesSaved, setChangesSaved] = useState(false);

  useEffect(() => {
    Axios.get(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${ParamsId}/column/${ColumnId}/cards.json`
    ).then((response) => {
      console.log("Cards Response: ", response.data);
      setmyCards(response.data);
      setChangesSaved(false);
    });
  }, [props.name, changesSaved]);

  const cardClickHandler = (cardId) => {
    setCardDetailModal(true);
    setCardIdForCardDetail(cardId);
  };

  const editHandler = (e, cardTitle, cardDescription, cardDueDate) => {
    e.preventDefault();
    setEditModal(true);
    setCardDetailModal(false);
    setEditCardTitle(cardTitle);
    setEditedDescription(cardDescription);
    setEditedDueDate(cardDueDate);
  };

  const archieveHandler = () => {
    // e.preventDefault();
    console.log("Archieve Button Clicked");
  };

  const saveEditedChanges = (e, id) => {
    e.preventDefault();
    const data = {
      title: editCardTitle,
      Description: editedDescription,
      Due_Date: editedDueDate,
      Members: editedTeamMembers,
    };
    Axios.put(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${ParamsId}/column/${ColumnId}/cards/${id}.json`,
      data
    )
      .then((response) => {
        console.log(response.data);
        setChangesSaved(true);
      })
      .catch((error) => {
        console.log("Error at saveEditedChanges: ", error);
      });
    setEditModal(false);
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
              {myCards &&
                item[1].Members.map((items) => (
                  <span key={items} className="initials">
                    {myCards &&
                      items
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                  </span>
                ))}
            </span>
          </div>
        ))}

      {Object.entries(myCards).map((item) =>
        item[0] == cardIdForCardDetail ? (
          <Modal isOpen={cardDetailModal}>
            <div className="headerContainer">
              <span>
                <h3>{item[1].title}</h3>
                <h4>in {match.params.name}</h4>
              </span>
              <span>
                <button
                  className="editCardDetail"
                  onClick={(e, cardTitle, cardDescription, cardDueDate) => {
                    editHandler(
                      e,
                      item[1].title,
                      item[1].Description,
                      item[1].Due_Date
                    );
                  }}
                >
                  Edit
                </button>
                <button className="archiveCardDetail" onClick={archieveHandler}>
                  Archive
                </button>
              </span>
            </div>
            <hr />
            <h3>Description</h3>
            <div>{item[1].Description}</div>
            <h3>Members</h3>
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
            <h3>Due Date</h3>
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

      {/* Modal for Editing Card Details */}
      {Object.entries(myCards).map((item) =>
        // console.log(item)
        item[0] == cardIdForCardDetail ? (
          <Modal isOpen={editModal}>
            <p className="boardName">Edit {item[1].title} Card</p>
            <form>
              <label htmlFor="title">Edit the title of your card</label>
              <br />
              <input
                type="text"
                id="title"
                value={editCardTitle}
                onChange={(e) => {
                  setEditCardTitle(e.target.value);
                  console.log(editCardTitle);
                }}
              />
              <br />
              <br />

              <label htmlFor="membersName">
                Choose members for this task (select multiple, if needed)
              </label>
              <br />
              <select
                id="membersName"
                multiple
                onChange={(e) => {
                  const values = [...e.target.selectedOptions].map(
                    (opt) => opt.value
                  );
                  setEditedTeamMembers(values);
                  console.log(editedTeamMembers);
                }}
              >
                <option>Please select atleast one team member</option>
                {props.allMembers.map((member) => (
                  <option value={member} key={member}>
                    {member}
                  </option>
                ))}
              </select>
              <br />
              <br />

              <label htmlFor="description">
                Edit the description of your task
              </label>
              <br />
              <input
                type="text"
                id="description"
                placeholder="Add your description here"
                value={editedDescription}
                onChange={(e) => {
                  setEditedDescription(e.target.value);
                }}
              />
              <br />
              <br />

              <label htmlFor="due_date">Edit the due date for this task</label>
              <br />
              <input
                type="date"
                value={editedDueDate}
                onChange={(e) => {
                  setEditedDueDate(e.target.value);
                }}
                id="due_date"
              />
              <br />
              <br />

              <button
                id="CreateCard"
                onClick={(e, id) => {
                  saveEditedChanges(e, item[0]);
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditModal(false);
                }}
              >
                Cancel
              </button>
            </form>
          </Modal>
        ) : (
          <></>
        )
      )}
    </div>
  );
}

export default withRouter(Cards);
