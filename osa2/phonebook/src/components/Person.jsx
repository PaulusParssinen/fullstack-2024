const Person = ({ value, onDelete }) => (
  <div>
    <span>
      {value.name} {value.number}
    </span>
    <button onClick={() => onDelete(value.id)}>delete</button>
  </div>
);

export default Person;
