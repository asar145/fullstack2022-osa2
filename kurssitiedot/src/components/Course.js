
const Header = ({course}) => (
  <div>
    <h2>
      {course.name}
    </h2>
  </div>
)

const Content = ({course}) => (
  <div>
    {course.parts.map(part => 
      <p key={part.id}>
        {part.name} {part.exercises}
      </p>
    )}
  </div>
)

const Total = ({course}) => {
  const initialValue = 0
  const total = course.parts.reduce( (s, p) => {
    return s + p.exercises
  }, initialValue)

  return (
    <div>
      <p>
        <b>total of {total} exercises</b>
      </p>
    </div>
  )
}

const Course = ({course}) => {

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course