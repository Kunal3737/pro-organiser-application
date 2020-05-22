import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import styles from "../Boards/Boards.module.css";
import "../Boards/Boards.css";
import { useState, useEffect } from "react";
import Modal from "react-modal";
// import Axios from "axios";
import Cards from "../Cards/Cards";
const axios = require("axios").default;

Modal.setAppElement("#root");
function Boards(props) {
  console.log("Props Location: ", props);
  const params = useParams();
  console.log("Params:", params);
  const [modal, setModal] = useState(false);
  const [myColumns, setmyColumns] = useState([]);
  const [CardModal, setCardModal] = useState(false);
  const [ColumnAdded, setColumnAdded] = useState(false);
  const [Members, setMembers] = useState([]);
  const [Team, setTeam] = useState("");
  const [Id, setId] = useState("");
  const [Title, setTitle] = useState("");
  const [paramsId, setparamsId] = useState(params.id);
  const [Description, setDescription] = useState("");
  const [DueDate, setDueDate] = useState("");
  const [ForCard, setForCard] = useState(false);
  const [Name, setName] = useState([]);
  const [forInitials, setForInitials] = useState([]);
  const [isColumnDelete, setIsColumnDelete] = useState(false);
  const [isCardMoved, setIsCardMoved] = useState(false);
  console.log(isCardMoved);
  console.log(forInitials);
  console.log("Team: ", Team);

  useEffect(() => {
    setColumnAdded(false);
    setIsCardMoved(false);
    // For fetching column
    axios
      .get(
        `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}/column.json`
      )
      .then((response) => {
        console.log("Get Response: ", response.data);
        const fetchedResult = [];
        for (let key in response.data) {
          fetchedResult.push({
            ...response.data[key],
            id: key,
          });
        }
        console.log("Id: ", fetchedResult);
        setmyColumns(fetchedResult);
      })
      .catch((error) => {
        console.log(error);
      });

    // For fetching Members Name
    axios
      .get(
        `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}.json`
      )
      .then((response) => {
        console.log("Members", response.data.team);
        const teamMembers = response.data.team.split(",");
        console.log("Team Members", teamMembers);
        setMembers(teamMembers);
        var array = [];
        for (var i = 0; i < teamMembers.length; i++) {
          console.log("Team Member", teamMembers[i]);
          var initial = teamMembers[i]
            .split(" ")
            .map((word) => {
              return word[0];
            })
            .join("");
          console.log("Initial", initial);
          array.push(initial);
          setForInitials(array);
        }
        console.log("Array", array);
        console.log("For Initials", forInitials);
      })

      .catch((error) => {
        console.log(error);
      });
    setIsColumnDelete(false);
  }, [ColumnAdded, !CardModal, isColumnDelete, isCardMoved]);

  const addColumnHandler = async (e) => {
    e.preventDefault();
    const column_name = document.getElementById("column_name").value;
    console.log(column_name);

    if (column_name !== "") {
      await axios
        .post(
          `https://pro-organizer-app-659cb.firebaseio.com/boards/${params.id}/column.json`,
          {
            column_name: column_name,
            cards: null,
          }
        )
        .then((response) => {
          console.log("RESPONSE", response.data);
          console.log("From Axios", column_name);
          console.log("key: ", response.data.name);
        })
        .catch((error) => {
          console.log(error);
        });
      setModal(false);
      setColumnAdded(true);
    }
  };

  const addCardHandler = async (e) => {
    e.preventDefault();
    setTitle(document.getElementById("title").value);
    console.log("Title :", Title);
    setDescription(document.getElementById("description").value);
    setDueDate(document.getElementById("due_date").value);

    if (
      document.getElementById("title").value !== "" &&
      Team !== "" &&
      (document.getElementById("description").value !== "") &
        (document.getElementById("due_date").value !== "")
    ) {
      await axios
        .post(
          `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}/column/${Id}/cards.json`,
          {
            title: document.getElementById("title").value,
            Members: Team,
            Description: document.getElementById("description").value,
            Due_Date: document.getElementById("due_date").value,
          }
        )
        .then((response) => {
          console.log(response.data);
          setName(response.data);
        });
      setCardModal(false);
      setForCard(true);
    }
  };

  const deleteBoardHandler = () => {
    axios
      .delete(
        `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}.json`
      )
      .then((response) => {
        console.log(response.data);
        props.history.push("/");
      })
      .then((error) => {
        console.log(error);
      });
  };

  const deleteColumnHandler = (columnId) => {
    axios
      .delete(
        `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}/column/${columnId}.json`
      )
      .then((response) => {
        console.log(response.data);
        setIsColumnDelete(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cardHandler = (newCard, droppedColumnId) => {
    console.log(newCard.cards);
    const key = Object.keys(newCard.cards);
    console.log(key[0]);
    console.log(droppedColumnId);
    const deleteData = key[0];
    const data = Object.values(newCard.cards);
    console.log(data[0]);

    axios
      .delete(
        `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}/column/${newCard.id}/cards/${deleteData}.json`
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post(
        `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}/column/${droppedColumnId}/cards.json`,
        data[0]
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsCardMoved(true);
    console.log(isCardMoved);
  };

  const cardDropped = (e, droppedColumnId) => {
    e.preventDefault();
    console.log(droppedColumnId);
    let newCard = JSON.parse(e.dataTransfer.getData("text/plain"));
    // let columnIdOfCard = JSON.parse(e.dataTransfer.getData("text/plain"));
    // console.log(items);
    cardHandler(newCard, droppedColumnId);
    // e.target.appendChild(newCard);
    // this.props.droppedCard(newCard, this.props.card_column);
  };

  return (
    <div className={styles.outerBoards}>
      <p className={styles.headerBoard}>
        <span className={styles.boardName}>{params.name} Board</span>
        <button className={styles.deleteBoard} onClick={deleteBoardHandler}>
          Delete Board
        </button>
      </p>
      <div className={styles.combiningArrayAndAddColumnButton}>
        <div className={styles.mappingColumns}>
          {myColumns.map((items) => (
            <div key={items.id} className="outerColumnDiv">
              <div className={styles.myColumn}>
                <div className={styles.forDustbin}>
                  {items.column_name}
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={(id) => {
                      deleteColumnHandler(items.id);
                    }}
                  />
                </div>
                <div
                  className="holdingCards"
                  onDragOver={(e) => {
                    e.preventDefault();
                    console.log(e.target);
                  }}
                  onDrop={(e, id) => {
                    cardDropped(e, items.id);
                  }}
                >
                  {items.cards && (
                    <Cards
                      members={forInitials}
                      data={items}
                      cardDragged={isCardMoved}
                      allMembers={Members}
                      title={Title}
                      paramsId={paramsId}
                      id={items.id}
                      description={Description}
                      dueDate={DueDate}
                      cardModal={CardModal}
                      forCard={ForCard}
                      name={Name}
                    />
                  )}
                </div>
                <button
                  className={styles.addCard}
                  onClick={() => {
                    setCardModal(true);
                    setForCard(false);
                    setId(items.id);
                  }}
                >
                  Add a card
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          className={styles.addColumn}
          onClick={() => {
            setModal(true);
          }}
        >
          <p className="columnbutton">Add a column</p>
        </div>
      </div>

      {/* Modal for Adding Column */}
      <Modal isOpen={modal}>
        <p className={styles.boardName}>Add Column</p>
        <form>
          <label>Name of the Column </label>
          <input id="column_name" type="text" required />
          <br />
          <br />
          <button
            id="CreateColumn"
            type="button"
            onClick={(e) => {
              addColumnHandler(e);
            }}
          >
            Add Column
          </button>
          <button
            id="closeModal"
            onClick={() => {
              setModal(false);
            }}
          >
            Close
          </button>
        </form>
      </Modal>

      {/*
             Modal for Adding Card */}
      <Modal isOpen={CardModal}>
        <p className={styles.boardName}>Add Card</p>
        <form>
          <label htmlFor="title">Enter a title for your task</label>
          <br />
          <input
            type="text"
            required
            id="title"
            placeholder="e.g. Add a new icon"
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
              setTeam(values);
            }}
          >
            <option>Please select atleast one team member</option>
            {Members.map((member) => (
              <option value={member} key={member}>
                {member}
              </option>
            ))}
          </select>
          <br />
          <br />

          <label htmlFor="description">Add the description for your task</label>
          <br />
          <input
            required
            type="text"
            id="description"
            placeholder="Add your description here"
          />
          <br />
          <br />

          <label htmlFor="due_date">Select the due date for this task</label>
          <br />
          <input required type="date" id="due_date" />
          <br />
          <br />
          <button id="CreateCard" onClick={addCardHandler}>
            Add Card
          </button>
          <button
            onClick={() => {
              console.log("Team", Team);
              setCardModal(false);
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Boards;
