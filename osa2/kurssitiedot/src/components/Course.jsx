const Header = ({ name }) => <h2>{name}</h2>;

const Content = ({ parts }) =>
  parts.map((part) => <Part key={part.id} part={part} />);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Total = ({ parts }) => (
  <b>total exercises: {parts.reduce((a, p) => a + p.exercises, 0)}</b>
);

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
