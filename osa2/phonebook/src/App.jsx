import { useEffect, useState } from "react";

import personService from "./services/persons";

import Filter from "./components/Filter";
import Notification from "./components/Notification";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [people, setPeople] = useState([]);

  const [filter, setFilter] = useState("");

  const [notification, setNotification] = useState(null);

  const personsToShow = people.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    personService.getAll().then((p) => setPeople(p));
  }, []);

  useEffect(() => {
    const resetErrorTimer = setTimeout(() => setNotification(null), 5000);

    return () => clearTimeout(resetErrorTimer);
  }, [notification]);

  const addPerson = (person) => {
    const existingPerson = people.find((p) => p.name === person.name);

    if (!existingPerson) {
      personService
        .create(person)
        .then((createdPerson) => {
          setPeople([...people, createdPerson]);
          setNotification({
            content: `Added ${createdPerson.name} to phonebook`,
            isError: false,
          });
        })
        .catch((error) =>
          setNotification({
            content: error.response.data.error,
            isError: true,
          })
        );
    } else {
      const replacePerson = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      );

      if (!replacePerson) return;

      personService
        .update(existingPerson.id, person)
        .then((updatedPerson) => {
          setPeople([
            updatedPerson,
            ...people.filter((p) => p.id !== existingPerson.id),
          ]);

          setNotification({
            content: `Updated ${updatedPerson.name}'s number`,
            isError: false,
          });
        })
        .catch((_error) =>
          setNotification({
            content: `Information of ${existingPerson.name} has already been removed from server`,
            isError: true,
          })
        );
    }
  };

  const deletePerson = (id) => {
    const person = people.find((p) => p.id === id);
    const deletePerson = window.confirm(`Delete ${person.name} ?`);

    if (!deletePerson) return;

    personService
      .remove(id)
      .then((_response) => {
        setPeople(people.filter((p) => p.id !== id));

        setNotification({
          content: `Removed ${person.name} from phonebook`,
          isError: false,
        });
      })
      .catch((_error) => {
        setNotification({
          content: `Information of ${person.name} has already been removed from server`,
          isError: true,
        });
      });
  };

  return (
    <>
      <h2>Phonebook</h2>
      <Notification value={notification} />

      <Filter
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />

      <h3>add a new</h3>
      <PersonForm onAdd={addPerson} />

      <h3>Numbers</h3>
      {personsToShow.map((person) => (
        <Person key={person.id} value={person} onDelete={deletePerson} />
      ))}
    </>
  );
};

export default App;
