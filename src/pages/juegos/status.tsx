import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { sessionOptions } from "../../lib/session";
import { EstatusJuego, JuegoEditData } from "../../types";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { changeStatus, findJuego } from "../../api-juegos";
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";

export const ChangeStatusForm: React.FC<{ user: User }> = ({ user }) => {
  if (user.role !== "PRESIDENTE" && user.role !== "COORDINADOR") {
    return <div>No tiene acceso a este modulo...</div>;
  }
  const router = useRouter();
  let {
    query: { juegoId },
  } = router;

  const [loading, setLoading] = React.useState(false);
  const [loadingJuego, setLoadingJuego] = React.useState(true);
  const [errorLoadingJuego, setErrorLoadingJuego] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState("");
  const [datos, setDatos] = React.useState<JuegoEditData>({
    id: "",
    fecha: "",
    duracion: 0,
    categoria: "",
    estadio: "",
    estatus: "",
    precio: null,
    arbitros: [],
  });
  const getJuego = async () => {
    try {
      const juego = await findJuego(juegoId as string);
      const fechaUTC = new Date(juego.fecha as string);
      setDatos({
        id: juegoId as string,
        fecha: `${fechaUTC
          .toISOString()
          .substring(0, 10)}, ${fechaUTC.toLocaleTimeString()}`,
        categoria: String(juego.categoriaJuego.nombre),
        estadio: String(juego.estadio.nombre),
        estatus: juego.estatus,
        duracion: juego.duracion,
        precio: juego.precio,
        arbitros: juego.arbitros,
      });
      setCurrentStatus(juego.estatus);
    } catch (error) {
      setErrorLoadingJuego(true);
    }
    setLoadingJuego(false);
  };
  useEffect(() => {
    getJuego();
  }, []);
  useEffect(() => {
    setDatos(datos);
  }, [datos]);

  if (errorLoadingJuego) return <div>Error cargando juego...</div>;

  if (loadingJuego == true) return <div>Cargando...</div>;

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
      await changeStatus(datos);
      alert("Estatus de juego cambiado!!!");
      event.target.reset();
    } catch (error) {
      alert("Ocurrió un error cambiar el estatus");
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Link
        href={{
          pathname: "/juegos",
          query: { fecha: datos.fecha.substring(0, 10) },
        }}
      >
        <a style={{ float: "right" }}>Volver</a>
      </Link>
      <h4>Actualizar estatus</h4>
      <Card>
        <Card.Header>Datos del juego</Card.Header>
        <Card.Body>
          <Container>
            <Row>
              <Col>
                <Card.Subtitle>Fecha</Card.Subtitle>
                <Card.Text>{datos.fecha}</Card.Text>
              </Col>
              <Col>
                <Card.Subtitle>Estadio</Card.Subtitle>
                <Card.Text>{datos.estadio}</Card.Text>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
                <Card.Subtitle>Categoría</Card.Subtitle>
                <Card.Text>{datos.categoria}</Card.Text>
              </Col>
              <Col>
                <Card.Subtitle>Estatus actual</Card.Subtitle>
                <Card.Text>{currentStatus}</Card.Text>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
                <Card.Subtitle>Árbitros</Card.Subtitle>
                {datos.arbitros.length ? (
                  <ListGroup>
                    {datos.arbitros.map((arbitro) => (
                      <ListGroup.Item key={arbitro.id}>
                        {arbitro.nombre} {arbitro.apellido}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  "Sin árbitros asignados"
                )}
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      <br></br>
      <Form.Group className="mb-3" controlId="formBasicEstatus">
        <Form.Label>Nuevo estatus</Form.Label>
        <Form.Select
          name="estatus"
          required
          onChange={handleSelectChange}
          value={datos.estatus}
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {Object.keys(EstatusJuego)
            .filter((estatus) => estatus !== "PROGRAMADO")
            .map((estatus) => (
              <option value={estatus} key={estatus}>
                {estatus}
              </option>
            ))}
        </Form.Select>
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

const ChangeStatus = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <ChangeStatusForm user={user} />
      </main>
    </Layout>
  );
};

export default ChangeStatus;

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
