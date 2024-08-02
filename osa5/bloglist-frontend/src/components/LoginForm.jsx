import { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    await onLogin(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username: </label>
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
            data-testid="username-input"
          />
        </div>
        <div>
          <label htmlFor="password">password: </label>
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
            data-testid="password-input"
          />
        </div>
        <button data-testid="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
