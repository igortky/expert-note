import * as Dialog from '@radix-ui/react-dialog'
import {X} from "lucide-react"
import { ChangeEvent, FormEvent, useState } from 'react'
import {toast} from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps ) {
  const [shouldShowDefaultText, setShouldShowDefaultText] = useState(true)
  const [content, setContent] = useState('')
  const [isRecordind, setIsRercoding] = useState(false)

  function handleStartEditor() {
    setShouldShowDefaultText(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const textValue = event.target.value
    setContent(textValue)
    if (textValue === '') {
      setShouldShowDefaultText(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()
    if(content === '') { return }
    onNoteCreated(content)
    setContent('');
    setShouldShowDefaultText(true);
    toast.success('Nota criata com sucesso')
  }

  function handleStartRecordind() {
    setIsRercoding(true)

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

   if (!isSpeechRecognitionAPIAvailable) {
    alert('Navegador não compoatível com API de gravacão')
    return
   }

   const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

   speechRecognition = new SpeechRecognitionAPI()

   setIsRercoding(true)
   setShouldShowDefaultText(false)
   speechRecognition.lang = 'pt-BR'
   speechRecognition.continuous = true
   speechRecognition.maxAlternatives = 1
   speechRecognition.interimResults = true

   speechRecognition.onresult = (event) => {
    const transcription = Array.from(event.results).reduce((text, result) => {
      return text.concat(result[0].transcript)
    }, '')

    setContent(transcription)
   }

   speechRecognition.onerror = (event) => {
    console.error(event.error)
   }

   speechRecognition.start()
  }



  function handleStopRecordind() {
    setIsRercoding(false)

    if(speechRecognition) {
      speechRecognition.stop()
    }
  }


  return (
    <Dialog.Root>
       <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
          <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
          <p className="text-sm leading-6 text-slate-400">
            Grave uma nota em áudio que será convertida para texto automaticamente.
            </p>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5"/>
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowDefaultText ?(
                <p className="text-sm leading-6 text-slate-400">
                Comece <button type='button' onClick={handleStartRecordind} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
              </p>
              ) : (
                <textarea
                autoFocus
                value={content}
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                onChange={handleContentChange}
                />
              ) }

            </div>

            {isRecordind ? (
              <button
                type="button"
                onClick={handleStopRecordind}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div  className="size-3 rounded-full bg-red-500 animate-pulse"/>
                Gravando (clique p/ interromper)
              </button>
            )
            :
            (
            <button
            type="button"
            onClick={handleSaveNote}
            className="w-full py-4 bg-lime-400 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
            >
              Salvar nota
            </button>
            )
            }
         </form>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
    </Dialog.Root>
  )
}