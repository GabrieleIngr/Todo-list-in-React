import { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function App() {
  const [rows, setRows] = useState(() => {
    //lazy initialization, it will run only once
    const saved = localStorage.getItem("rows");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  function newRow(row) {
    setRows([row, ...rows]);
  }

  function updateRow(newRow) {
    setRows(
      rows.map((row) =>
        row.id === newRow.id ? { ...row, text: newRow.text } : row
      )
    );
  }

  function deleteRow(row) {
    setRows(rows.filter((existingrow) => existingrow.id !== row.id));
  }

  return (
    <div className="App">
      <div className="container">
        <h1>What's the plan for today? 🤯</h1>
        <UserInput newRow={newRow} />
        <Rows rows={rows} deleteRow={deleteRow} updateRow={updateRow} />
      </div>
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function UserInput({ newRow }) {
  const [inputValue, setInputValue] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue.trim()) return; // return if the text input is empty
    const myRow = {
      //creation of a new object to pass on
      id: Date.now(),
      text: inputValue.slice(0, 30),
      backgroundColor: getRandomColor(),
    };
    newRow(myRow);

    setInputValue("");
  }

  return (
    <form className="userInput" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a todo"
        maxLength="30"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value.slice(0, 30))}
      />
      <Button>Add Todo</Button>
    </form>
  );
}

function Rows({ rows, deleteRow, updateRow }) {
  const [isEditing, setIsEditing] = useState(false);
  const [id, setID] = useState(null);

  return (
    <ul>
      {rows.map((row) => (
        <Row
          key={row.id}
          todo={row}
          deleteRow={deleteRow}
          updateRow={updateRow}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setID={setID}
          shouldHide={isEditing && id !== row.id} //logic to hide the rows
        />
      ))}
    </ul>
  );
}

function Row({
  todo,
  deleteRow,
  updateRow,
  setID,
  isEditing,
  setIsEditing,
  shouldHide,
}) {
  const [isActive, setisActive] = useState(false);

  function handleClick() {
    setisActive(true); // this will set the complete effect
  }

  function handleSave(updatedText) {
    updateRow({ ...todo, text: updatedText }); //we passed only the text but the row function remembers it's whole object passed by it's parent rows as 'todo'
    setIsEditing(false);
  }

  if (shouldHide) {
    //hides all the rows execpt the one that we are editing
    return null;
  }

  return (
    <>
      {isEditing ? (
        <EditInput handleSave={handleSave} todo={todo} />
      ) : (
        <li
          className={`row ${isActive ? "complete" : ""}`}
          style={{ backgroundColor: todo.backgroundColor }}
          onClick={handleClick}
        >
          {todo.text}
          <div className="icons">
            <MdCancel
              onClick={(e) => {
                e.stopPropagation(); // this will avoid activating the complete effect
                deleteRow(todo);
              }}
            />
            <FaEdit
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setID(todo.id);
              }}
            />
          </div>
        </li>
      )}
    </>
  );
}

function EditInput({ handleSave, todo }) {
  //in charge of modifying the row switching to another input field
  const [inputValue, setInputValue] = useState(todo.text);

  function handleSubmit(e) {
    e.preventDefault();

    if (!inputValue.trim()) return;
    handleSave(inputValue.slice(0, 30));
  }

  return (
    <form className="userInput edit" onSubmit={handleSubmit}>
      <input
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value.slice(0, 30))}
        maxLength="30"
      />
      <Button>Update</Button>
    </form>
  );
}

export default App;
