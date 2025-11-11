import "./login.css";

export default function LoginPage() {
  return (
    <main>
      <form>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" required></input>

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required></input>

        <div className="checkbox-container">
          <input id="remember" type="checkbox" name="remember"></input>
          <label htmlFor="remember">Remember Me</label>
        </div>

        <button type="submit">Login</button>
      </form>
    </main>
  );
}
