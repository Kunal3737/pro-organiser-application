import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import "../Boards/Boards.css";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Axios from "axios";
import Cards from "../Cards/Cards";

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
  const [MemberSelected, setMemberSelected] = useState(false);
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
  console.log(forInitials);
  console.log("Team: ", Team);

  useEffect(() => {
    setColumnAdded(false);
    // For fetching column
    Axios.get(
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
    Axios.get(
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
  }, [ColumnAdded, !CardModal, isColumnDelete]);

  const addColumnHandler = async (e) => {
    e.preventDefault();
    const column_name = document.getElementById("column_name").value;
    console.log(column_name);

    await Axios.post(
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
  };

  const addCardHandler = async (e) => {
    e.preventDefault();
    setTitle(document.getElementById("title").value);
    console.log("Title :", Title);
    setDescription(document.getElementById("description").value);
    setDueDate(document.getElementById("due_date").value);
    await Axios.post(
      `https://pro-organizer-app-659cb.firebaseio.com/boards/${paramsId}/column/${Id}/cards.json`,
      {
        title: document.getElementById("title").value,
        Members: Team,
        Description: document.getElementById("description").value,
        Due_Date: document.getElementById("due_date").value,
      }
    ).then((response) => {
      console.log(response.data);
      setName(response.data);
    });
    setCardModal(false);
    setForCard(true);
  };

  const deleteBoardHandler = () => {
    Axios.delete(
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
    Axios.delete(
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

  return (
    <div className="outerBoards">
      <p className="headerBoard">
        <span className="boardName">{params.name} Board</span>
        <button className="deleteBoard" onClick={deleteBoardHandler}>
          Delete Board
        </button>
      </p>
      <div className="combiningArrayAndAddColumnButton">
        <div className="mappingColumns">
          {myColumns.map((items) => (
            <div key={items.id} className="outerColumnDiv">
              <div className="myColumn">
                <div className="forDustbin">
                  {items.column_name}
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={(id) => {
                      deleteColumnHandler(items.id);
                    }}
                  />
                </div>
                {items.cards && (
                  <Cards
                    members={forInitials}
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
                <button
                  className="addCard"
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
          className="addColumn"
          onClick={() => {
            setModal(true);
          }}
        >
          <p className="columnbutton">Add a column</p>
        </div>
      </div>

      {/* Modal for Adding Column */}
      <Modal isOpen={modal}>
        <p className="boardName">Add Column</p>
        <form>
          <label>Enter a column name:</label>
          <input id="column_name" type="text" />
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
        <p className="boardName">Add Card</p>
        <form>
          <label htmlFor="title">Enter a title for your task</label>
          <br />
          <input type="text" id="title" placeholder="e.g. Add a new icon" />
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
            type="text"
            id="description"
            placeholder="Add your description here"
          />
          <br />
          <br />

          <label htmlFor="due_date">Select the due date for this task</label>
          <br />
          <input type="date" id="due_date" />
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
