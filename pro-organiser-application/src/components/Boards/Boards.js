import React from "react";
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
        let firstMember = "";
        for (let i = 0; i < teamMembers.length; i++) {
          firstMember = firstMember + teamMembers[i].split(" ");
          console.log("FirstMembers", firstMember[0]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  }, [ColumnAdded]);

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
          "Due Date": document.getElementById("due_date").value,
        }
      ).then((response) => {
        console.log(response.data);
        setName(response.data);
      });
      setCardModal(false);
      setForCard(true);
  };

  return (
    <div className="outerBoards">
      <p className="boardName">{params.name} Board</p>
      <div className="combiningArrayAndAddColumnButton">
        <div className="mappingColumns">
          {myColumns.map((items) => (
            <div key={items.id} className="outerColumnDiv">
              <div className="myColumn">
                <div className="forDustbin">
                  {items.column_name}
                  <img
                    src="data:image/jpeg;base64,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"
                    className="dustbinImage"
                    alt="Dustbin-icon"
                    onClick={() => {
                      console.log("Delete Button Clicked");
                    }}
                  />
                </div>
                {Id === items.id ? (
                  <Cards
                    members={Members}
                    title={Title}
                    paramsId={paramsId}
                    id={Id}
                    description={Description}
                    dueDate={DueDate}
                    cardModal={CardModal}
                    forCard={ForCard}
                    name={Name}
                  />
                ) : (
                  false
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
          <button
            id="CreateCard"
            onClick={addCardHandler}
          >
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
