const LoginForm=({ username,password,handleLogin,setUsername,setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      <h1>Log in to application</h1>
        username
      <input
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
        password
      <input
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button id="login-button" type="submit">login</button>
  </form>
)

export default LoginForm