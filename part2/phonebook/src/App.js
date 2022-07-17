import { useState, useEffect } from 'react'
import Person from './components/Person'
import Form from './components/Form'
import Filter from './components/Filter'
import Title from './components/Title'
import Alert from './components/Alert'
import server from './services/server'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '123-123456' },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newText, setText] = useState('')
  const [color, setColor] = useState('green')

  const handleSetPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()

    let newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, would you like to replace the old number with the new one?`)) {
        const prevPerson = persons.filter(person => person.name === newName) //find() was probably easier in hindsight
        server.updatePerson(prevPerson[0].id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== prevPerson[0].id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
            setText(`Successfully updated ${updatedPerson.name}`)
            setColor('green')
            setTimeout(() => {
              setText(null)
            }, 5000)
          })
          .catch(error => {
            alert(
              `The person cannot be updated.`)
            setPersons(persons.filter(person => person.name !== newPerson.name))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }
    server.createPerson(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        setText(`Successfully added ${createdPerson.name}`)
        setColor('green')
        setTimeout(() => {
          setText(null)
        }, 5000)
      })
      .catch(error => { 
        setText(`User cannot be added to the phonebook.`)
        setColor('red')
        setTimeout(() => {
          setText(null)
        }, 5000)
        setPersons(persons.filter(person => person.name !== newPerson.name))
        setNewName('')
        setNewNumber('')
      })
  }

  const showPersons = () => {
    if (newFilter === '') {
      return persons
    }
    else {
      return persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    }
  }

  const deletePerson = name => {
    const person = persons.find(person => person.name === name)
    if (window.confirm(`Are you sure you want to delete ${person.name}? `)) {
      server.deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(person => person.name !== name))
          setText(`Successfully deleted ${name}`)
          setColor('green')
          setTimeout(() => {
            setText(null)
          }, 5000)
        })
        .catch(error => { 
          setText(`The person have been already deleted from the phonebook`)
          setColor('red')
          setTimeout(() => {
            setText(null)
          }, 5000)
          setPersons(persons.filter(person => person.name !== name))
        })
    }
  }

  useEffect(() => {
    server.getAllPersons()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])


  return (
    <div>
      <Title title='Phonebook' />
      <Alert text={newText} color={color} />
      <Filter inputNameValue={newFilter} inputNameChangeFunc={handleFilterChange} />
      <Title title='Add a new contact' />
      <Form submitFunc={handleAddPerson} nameValue={newName} phoneValue={newNumber} inputChangeFunc={handleSetPerson} inputPhoneFunc={handleNumberChange} buttonDesc='add' />
      <Title title='Numbers' />
      {showPersons().map((person) => <Person key={person.name} name={person.name} number={person.number} deleteOne={deletePerson} />)}
    </div>
  )
}

export default App;