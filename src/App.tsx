import { ChangeEvent, useState } from 'react'
import logo from './assets/nlw-expert-logo.svg'
import { NewNoteCard } from './components/NewNoteCard'
import { NoteCard } from './components/NoteCard'

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage= localStorage.getItem('notes')

    if(notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date,
      content: content
    }

    const noteArray = [newNote, ...notes ]

    setNotes(noteArray)

    localStorage.setItem('notes', JSON.stringify(noteArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query);
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt='NLW Expert'/>

      <form className="w-full">
        <input
          type="text"
          placeholder='Busque em suas notas...'
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder:text-slate-500"
          onChange={handleSearch}
          />
      </form>
      <div className="h-px bg-slate-600" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard  onNoteCreated={onNoteCreated} />
        {filteredNotes.map(note => {
          return  <NoteCard key={note.id} note={note}/>
        })}
      </div>
    </div>
   )
}
