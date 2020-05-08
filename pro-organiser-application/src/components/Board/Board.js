import React, {useState} from 'react';
import '../Board/Board.css';
import Axios from 'axios';
import {useHistory} from 'react-router-dom';

function Board() {
    const history = useHistory();
    console.log(history);

    const createButtonHandler = async (e) => {
        e.preventDefault();
        let myname = document.getElementById('name').value;
        console.log(myname);
        let myteam = document.getElementById('team').value;
        console.log(myteam);
        let teamMembersName = myteam.split(",");
        console.log(teamMembersName);
        let mytype = document.getElementById('type').value;
        console.log(mytype);

        await Axios.post(`https://pro-organizer-app-659cb.firebaseio.com/boards.json`, {
            "name" : myname,
            "team" : myteam,
            "type" : mytype,
        })
        .then(response => {
            console.log(response.data);
        })

        alert(`You successfully created a board named : "${myname}"`);
        history.push('/', myname);
    }

    return (
        <div className="wrapperDivBoard">
            <h2 className="boardHeading">Create a Board</h2>
            <form onSubmit={createButtonHandler} >
                <label htmlFor="name">Enter a name for your board</label><br/>
                <input 
                    required 
                    className="inputFieldsForCAB" 
                    type="text" 
                    placeholder="e.g. Agile Sprint Board" 
                    id="name" />
                <br/><br/>
                <label htmlFor="team" >Add your team members</label><br/>
                <input 
                    required 
                    className="inputFieldsForCAB" 
                    id="team"
                    type="text" 
                    placeholder="Member names should be separated by commas" />
                <br/><br/>
                <label htmlFor="type" >Enter the type of your board</label><br/>
                <input 
                    required 
                    className="inputFieldsForCAB" 
                    id="type" 
                    type="text" 
                    placeholder="e.g. Design board, Testing board, etc." />
                <br/><br/>
                <button type="submit" id="CreateBoard" >Create</button>
            </form>
        </div>
    )
}

export default Board
