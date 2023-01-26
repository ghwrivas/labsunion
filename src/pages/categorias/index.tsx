import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { sessionOptions } from "../../lib/session";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { CategoriaData, CategoriaJuego } from "../../types";
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
import {
  createCategoria,
  editCategoria,
  useCategorias,
} from "../../api-categorias";

export const CategoriasList: React.FC<{ user: User }> = ({ user }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDatos({
      id: "",
      nombre: "",
      precio: "",
      activo: "false",
    });
    setShowEditForm(false);
  };

  const handleShow = (categoria: CategoriaJuego) => {
    if (categoria !== null) {
      setDatos({
        id: String(categoria.id),
        nombre: categoria.nombre,
        precio: String(categoria.precio),
        activo: categoria.activo ? "true" : "false",
      });
    }
    setShowEditForm(true);
  };

  const { data: categorias, error } = useCategorias();

  const [datos, setDatos] = useState<CategoriaData>({
    id: "",
    nombre: "",
    precio: "",
    activo: "false",
  });

  useEffect(() => {
    setDatos(datos);
  }, [datos]);

  if (error != null) return <div>Error cargando categorías...</div>;
  if (categorias == null) return <div>Cargando...</div>;

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
        await createCategoria(datos);
      } else {
        await editCategoria(datos);
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
        <h4>Categorías</h4>
        {user.role === "ADMIN" ? (
          <Button
            variant="link"
            style={{ float: "right" }}
            onClick={() => handleShow(null)}
          >
            Nuevo
          </Button>
        ) : null}
      </div>
      {categorias.map((categoria) => (
        <Card style={{ margin: "0.2rem" }} key={categoria.id}>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Card.Subtitle>Nombre</Card.Subtitle>
                  <Card.Text>{categoria.nombre}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Precio</Card.Subtitle>
                  <Card.Text>$ {categoria.precio}</Card.Text>
                </Col>
                <Col>
                  <Card.Subtitle>Activo </Card.Subtitle>
                  <Card.Text>{categoria.activo ? "Si" : "No"}</Card.Text>
                </Col>
              </Row>
            </Container>
            <Button
              style={{ float: "right" }}
              variant="link"
              onClick={() => handleShow(categoria)}
            >
              Editar
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Modal show={showEditForm} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{datos.id ? "Editar" : "Nuevo"} categoría</Modal.Title>
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
            <Form.Group className="mb-3" controlId="editForm.precio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="10"
                autoFocus
                name="precio"
                value={datos.precio}
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

const Categorias = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <CategoriasList user={user} />
      </main>
    </Layout>
  );
};

export default Categorias;

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
