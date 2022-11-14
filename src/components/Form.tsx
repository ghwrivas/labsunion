import { FormEvent } from "react";

export default function Form({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Correo electrónico</span>
        <input type="email" name="username" required />
      </label>
      <label>
        <span>Contraseña</span>
        <input type="password" name="password" required />
      </label>

      <button type="submit">Iniciar sesión</button>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  );
}
