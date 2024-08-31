import { useDispatch } from "react-redux";
import { filterChange } from "../reducers/filterReducer";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => dispatch(filterChange(event.target.value));

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
