import { useState } from "react";

const PersonForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ name, number });
        setName("");
        setNumber("");
      }}
    >
      <div>
        <label>name: </label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>number: </label>
        <input
          name="number"
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default PersonForm;
