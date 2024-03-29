import { useMutation, useQuery, useQueryClient } from 'react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import VoteButton from './components/VoteButton'

const App = () => {

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      console.log('Updated anecdote', updatedAnecdote)
      const updatedAnecdotes = anecdotes.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
      queryClient.setQueryData('anecdotes', updatedAnecdotes);
    }
  })


  const result = useQuery('anecdotes', getAnecdotes)  
  console.log('Result', result)

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {'"' + anecdote.content + '" '}
            has {anecdote.votes} votes
          </div>
          <div>
            <VoteButton 
            anecdote={anecdote} 
            updateAnecdoteMutation={updateAnecdoteMutation} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
