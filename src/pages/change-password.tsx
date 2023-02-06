import { withIronSessionSsr } from "iron-session/next";
import React, { useEffect } from "react";

import { InferGetServerSidePropsType } from "next";
import Form from "react-bootstrap/Form";
import { Button, Spinner } from "react-bootstrap";
import { ChangePasswordData } from "../types";
import { createGasto } from "../api-gastos";
import Layout from "../components/Layout";
import { sessionOptions } from "../lib/session";
import { User } from "./api/user";
import { changePassword } from "../api-password";

export const ChangePasswordForm: React.FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = React.useState(false);
  const [samePassword, setSamePassword] = React.useState(false);

  const [datos, setDatos] = React.useState<ChangePasswordData>({
    newPassword: "",
    oldPassword: "",
    verifyNewPassword: "",
  });

  useEffect(() => {
    setDatos(datos);
    console.log(`-${datos.newPassword}-`, `-${datos.verifyNewPassword}-`);
    if (
      (datos.newPassword === "" && datos.verifyNewPassword === "") ||
      (datos.newPassword &&
        datos.verifyNewPassword &&
        datos.newPassword === datos.verifyNewPassword)
    ) {
      setSamePassword(true);
    } else {
      setSamePassword(false);
    }
  }, [datos, samePassword]);

  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await changePassword(datos);
      setDatos({
        ...datos,
        oldPassword: "",
        newPassword: "",
        verifyNewPassword: "",
      });
      alert("Contraseña cambiada correctamente!!!");
      event.target.reset();
    } catch (error) {
      alert(error.data.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Cambiar contraseña</h4>
      <Form.Group className="mb-3" controlId="formBasicOldPassword">
        <Form.Label>Contraseña actual</Form.Label>
        <Form.Control
          autoFocus
          type="password"
          placeholder=""
          name="oldPassword"
          minLength={4}
          value={datos.oldPassword}
          required
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicNewPassword">
        <Form.Label>Nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          name="newPassword"
          minLength={4}
          value={datos.newPassword}
          required
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicVerifyNewPassword">
        <Form.Label>Repita nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          name="verifyNewPassword"
          minLength={4}
          value={datos.verifyNewPassword}
          required
          onChange={handleInputChange}
        />
        {!samePassword ? (
          <Form.Text className="text-muted">
            Las contraseñas no coinciden
          </Form.Text>
        ) : null}
      </Form.Group>
      <br></br>
      <div className="mx-auto .mt-1" style={{ width: "200px" }}>
        <Button
          style={{ width: "200px" }}
          variant="primary"
          type="submit"
          disabled={loading}
        >
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
            "Guardar"
          )}
        </Button>
      </div>
    </Form>
  );
};

const ChangePassword = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <ChangePasswordForm user={user} />
      </main>
    </Layout>
  );
};

export default ChangePassword;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: {
          isLoggedIn: false,
          nombre: "",
          correo_electronico: "",
          role: "",
        } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
