import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { sessionOptions } from "../../lib/session";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { Estadio, EstadioData } from "../../types";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { createEstadio, editEstadio, useEstadios } from "../../api-estadios";

export const EstadiosList: React.FC<{ user: User }> = ({ user }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDatos({
      id: "",
      nombre: "",
      activo: "false",
    });
    setShowEditForm(false);
  };

  const handleShow = (estadio: Estadio) => {
    if (estadio !== null) {
      setDatos({
        id: String(estadio.id),
        nombre: estadio.nombre,
        activo: estadio.activo ? "true" : "false",
      });
    }
    setShowEditForm(true);
  };

  const { data: estadios, error } = useEstadios();

  const [datos, setDatos] = useState<EstadioData>({
    id: "",
    nombre: "",
    activo: "false",
  });

  useEffect(() => {
    setDatos(datos);
  }, [datos]);

  if (error != null) return <div>Error cargando estadios...</div>;
  if (estadios == null) return <div>Cargando...</div>;

  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckChange = (event) => {
    if (event.target.checked) {
      setDatos({
        ...datos,
        [event.target.name]: "true",
      });
    } else {
      setDatos({
        ...datos,
        [event.target.name]: "false",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (datos.id === "") {
        await createEstadio(datos);
      } else {
        await editEstadio(datos);
      }
      alert("Datos guardados!!!");
      event.target.reset();
    } catch (error) {
      alert("Ocurrió un error, vuelva a intentar");
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Estadios</h4>
        {user.role !== "ARBITRO" ? (
          <Button
            variant="link"
            style={{ float: "right" }}
            onClick={() => handleShow(null)}
          >
            Nuevo
          </Button>
        ) : null}
      </div>
      {estadios.map((estadio) => (
        <Card style={{ margin: "0.2rem" }} key={estadio.id}>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Card.Subtitle>Nombre</Card.Subtitle>
                  <Card.Text>{estadio.nombre}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Activo </Card.Subtitle>
                  <Card.Text>{estadio.activo ? "Si" : "No"}</Card.Text>
                </Col>
              </Row>
            </Container>
            {user.role !== "ARBITRO" ? (
              <Button
                style={{ float: "right" }}
                variant="link"
                onClick={() => handleShow(estadio)}
              >
                Editar
              </Button>
            ) : null}
          </Card.Body>
        </Card>
      ))}
      <Modal show={showEditForm} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{datos.id ? "Editar" : "Nuevo"} estadio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editForm.nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tamaca"
                autoFocus
                name="nombre"
                value={datos.nombre}
                required
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                reverse
                checked={datos.activo == "true"}
                name="activo"
                type="checkbox"
                id="editForm.activo"
                label="Activo"
                value={datos.activo}
                onChange={handleCheckChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
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
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

const Estadios = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <EstadiosList user={user} />
      </main>
    </Layout>
  );
};

export default Estadios;

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
