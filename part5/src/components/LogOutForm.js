const LogOutForm = () => {
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
  }
  return(
    <form onSubmit={handleLogout}>
      <button id='logout-button' type='submit'>Log out</button>
    </form>
  )
}

export default LogOutForm