import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { sessionOptions } from "../../lib/session";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { createArbitro, editArbitro, useArbitros } from "../../api-arbitros";
import { Arbitro, ArbitroEditData, Role } from "../../types";
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

export const ArbitrosList: React.FC<{ user: User }> = ({ user }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDatos({
      id: "",
      nombre: "",
      apellido: "",
      fecha_nacimiento: "",
      correo_electronico: "",
      role: "",
      activo: "false",
    });
    setShowEditForm(false);
  };

  const handleShow = (arbitro: Arbitro) => {
    if (arbitro !== null) {
      setDatos({
        id: String(arbitro.id),
        nombre: arbitro.nombre,
        apellido: arbitro.apellido,
        fecha_nacimiento: arbitro.fecha_nacimiento.toString().substring(0, 10),
        correo_electronico: arbitro.correo_electronico,
        role: arbitro.role,
        activo: arbitro.activo ? "true" : "false",
      });
    }
    setShowEditForm(true);
  };

  const { data: arbitros, error } = useArbitros();

  const [datos, setDatos] = useState<ArbitroEditData>({
    id: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    correo_electronico: "",
    role: "",
    activo: "false",
  });

  useEffect(() => {
    setDatos(datos);
  }, [datos]);

  if (error != null) {
    if (error.data && error.data.status === "forbidden") {
      return <div>No tiene acceso a este modulo...</div>;
    }
    return <div>Error cargando árbitros...</div>;
  }
  if (arbitros == null) return <div>Cargando...</div>;

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

  const handleSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("value") || "";
    setDatos({
      ...datos,
      [event.target.name]: option,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (datos.id === "") {
        await createArbitro(datos);
      } else {
        await editArbitro(datos);
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
        <h4>Árbitros</h4>
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
      {arbitros.map((arbitro) => (
        <Card style={{ margin: "0.2rem" }} key={arbitro.id}>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Card.Subtitle>Nombre</Card.Subtitle>
                  <Card.Text>{arbitro.nombre}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Apellido</Card.Subtitle>
                  <Card.Text>{arbitro.apellido}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Cumpleaños </Card.Subtitle>
                  <Card.Text>
                    {arbitro.fecha_nacimiento.toString().substring(0, 10)}
                  </Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Subtitle>Correo</Card.Subtitle>
                  <Card.Text>{arbitro.correo_electronico}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Rol</Card.Subtitle>
                  <Card.Text>{arbitro.role}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Activo </Card.Subtitle>
                  <Card.Text>{arbitro.activo ? "Si" : "No"}</Card.Text>
                </Col>
              </Row>
            </Container>
            {user.role !== "ARBITRO" ? (
              <Button
                style={{ float: "right" }}
                variant="link"
                onClick={() => handleShow(arbitro)}
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
            <Modal.Title>{datos.id ? "Editar" : "Nuevo"} árbitro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editForm.nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Jesus"
                autoFocus
                name="nombre"
                value={datos.nombre}
                required
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editForm.apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lopez"
                name="apellido"
                value={datos.apellido}
                required
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editForm.correo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correo_electronico"
                value={datos.correo_electronico}
                required
                placeholder="wualter@gmail.com"
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editForm.fecha">
              <Form.Label>Cumpleaños</Form.Label>
              <Form.Control
                type="date-local"
                placeholder="1980-01-01"
                name="fecha_nacimiento"
                value={datos.fecha_nacimiento}
                required
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editForm.role">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="role"
                required
                value={datos.role}
                onChange={handleSelectChange}
              >
                <option id={null} value="" key="">
                  Seleccione
                </option>
                {Object.keys(Role).map((rol) => (
                  <option value={"" + rol} key={rol}>
                    {rol}
                  </option>
                ))}
              </Form.Select>
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

const Arbitros = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <ArbitrosList user={user} />
      </main>
    </Layout>
  );
};

export default Arbitros;

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
