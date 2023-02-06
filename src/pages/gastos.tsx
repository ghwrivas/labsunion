import { withIronSessionSsr } from "iron-session/next";
import React, { useEffect } from "react";

import { InferGetServerSidePropsType } from "next";
import Form from "react-bootstrap/Form";
import { Button, Spinner } from "react-bootstrap";
import { GastoCreateData } from "../types";
import { createGasto } from "../api-gastos";
import Layout from "../components/Layout";
import { sessionOptions } from "../lib/session";
import { User } from "./api/user";

export const GastoCreateForm: React.FC<{ user: User }> = ({ user }) => {
  if (user.role !== "PRESIDENTE" && user.role !== "TESORERO") {
    return <div>No tiene acceso a este modulo...</div>;
  }
  const [loading, setLoading] = React.useState(false);
  const [datos, setDatos] = React.useState<GastoCreateData>({
    monto: 0,
    descripcion: "",
  });

  useEffect(() => {
    setDatos(datos);
  }, [datos]);

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
      await createGasto(datos);
      setDatos({
        ...datos,
        monto: 0,
        descripcion: "",
      });
      alert("Gasto guardado!!!");
      event.target.reset();
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Registrar gasto</h4>
      <Form.Group className="mb-3" controlId="formBasicMonto">
        <Form.Label>Monto</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ej: 10"
          name="monto"
          min={1}
          value={datos.monto}
          required
          onChange={handleInputChange}
        />
        <Form.Text className="text-muted">
          El monto del dinero gastado.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicDescripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          rows={3}
          maxLength={100}
          placeholder="Ej: Papelería"
          name="descripcion"
          value={datos.descripcion}
          required
          onChange={handleInputChange}
        />
        <Form.Text className="text-muted">
          Ej: Papelería, Compra de franelas, Colaboración con árbitro
        </Form.Text>
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

const Gastos = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <GastoCreateForm user={user} />
      </main>
    </Layout>
  );
};

export default Gastos;

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
