import { FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function LoginForm({
  loading,
  errorMessage,
  onSubmit,
}: {
  loading;
  errorMessage: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Correo electrónico"
          required
          name="username"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Constraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Constraseña"
          required
          name="password"
        />
      </Form.Group>
      {errorMessage && (
        <Alert key="danger" variant="danger">
          {errorMessage}
        </Alert>
      )}
      <Button variant="dark" type="submit" disabled={loading}>
        {loading ? (
          <div>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            ></Spinner>
            Enviando...
          </div>
        ) : (
          "Enviar"
        )}
      </Button>
    </Form>
  );
}
