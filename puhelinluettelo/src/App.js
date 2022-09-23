
import { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

const Button = ({handleClick, text}) => (
  <>
    <button onClick={handleClick}>
      {text}
    </button>
  </>
)

const Notification = ({ message, cssClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={cssClass} >
      {message}
    </div>
  )
}

const Filter = ({handleFilterChange, filter}) => {
  return (
    <form>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange}/>
      </div>
    </form>
  )
}

const PersonForm = (props) => {

  const addEntry = (event) => {
    event.preventDefault()
    let matchId = 0
    let nameExists = false
    props.persons.forEach(person => {
      if (person.name === props.newName) {
        matchId = person.id
        nameExists = true
      }
    })
    
    if (nameExists) {
      if (window.confirm(`${props.newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newObject = {
          name: props.newName,
          number: props.newNumber
        }
        personsService
          .update(matchId, newObject)
          .then(response => {
            props.setPersons(props.persons.map(person => person.id !== matchId ? person : response.data))
            props.setNewName('')
            props.setNewNumber('')
            props.setCssClass("confirmation")
            props.setErrorMessage(`Updated ${props.newName}`)
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)
          })
          .catch(() => {
            props.setPersons(props.persons.filter(person => person.name !== props.newName))
            props.setCssClass("error")
            props.setErrorMessage(`Information of ${props.newName} has already been removed from server`)
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      const newObject = {
        name: props.newName,
        number: props.newNumber
      }
      personsService
        .create(newObject)
        .then(response => {
          props.setPersons(props.persons.concat(response.data))
          props.setNewName('')
          props.setNewNumber('')
          props.setCssClass("confirmation")
          props.setErrorMessage(`Created ${props.newName}`)
          setTimeout(() => {
            props.setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <form onSubmit={addEntry}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, setPersons, filter, setErrorMessage, setCssClass}) => {

  const delObjectById = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personsService
      .delInstance(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setCssClass("confirmation")
        setErrorMessage(`Deleted ${name}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

  const personsToShow = (filter === '')
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      {personsToShow.map(person => 
        <p key={person.name}>
          {person.name} {person.number} <Button handleClick={() => delObjectById(person.id, person.name)} text="delete"/>
        </p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [cssClass, setCssClass] = useState('confirmation')

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
    <h2>Phonebook</h2>
    <Notification message={errorMessage} cssClass={cssClass}/>
    <Filter handleFilterChange={handleFilterChange} filter={filter} />
    <h3>Add a new</h3>
    <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} 
                setPersons={setPersons} setNewName={setNewName} setNewNumber={setNewNumber} 
                persons={persons} newName={newName} newNumber={newNumber}
                setErrorMessage={setErrorMessage} setCssClass={setCssClass}/>
    <h3>Numbers</h3>
    <Persons persons={persons} setPersons={setPersons} filter={filter} 
              setErrorMessage={setErrorMessage} setCssClass={setCssClass}/>
    </div>
  )

}

export default App