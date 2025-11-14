import "./register.css";

export default function RegisterPage() {
  return (
    <main>
      <form>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" required></input>

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required></input>

        <button type="submit">Register</button>
      </form>
    </main>
  );
}
