const Header = (props) => <h1>{props.course.name}</h1>

const Content = ({ parts }) => parts.map(part => <Part key={part.name} part={part} />)

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Total = ({ parts }) => <p>Number of exercises: {parts.reduce((a, p) => a + p.exercises, 0)}</p>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App