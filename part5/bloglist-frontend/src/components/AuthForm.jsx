

const AuthForm = ({ submitFunc, username, password, usernameFunc, passwordFunc, buttonDesc }) => {
  return (
    <form onSubmit={submitFunc}>
      <div>
                username: <input value={username} id='usernameLogin' onChange={usernameFunc} />
      </div>
      <div>
                password: <input type="password" id='passwordLogin' value={password} onChange={passwordFunc} />
      </div>
      <div>
        <button type="submit" id='loginbutton'>{buttonDesc}</button>
      </div>
    </form>
  )
}

export default AuthForm