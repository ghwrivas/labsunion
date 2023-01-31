import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { deleteJuego, useJuegos } from "../api-juegos";
import Layout from "../components/Layout";
import { sessionOptions } from "../lib/session";
import styles from "../styles/Juegos.module.css";
import { Arbitro, Juego } from "../types";
import { User } from "./api/user";

export const JuegoList: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter();
  let {
    query: { fecha: fechaToFilter },
  } = router;

  const [fecha, setFecha] = useState((fechaToFilter as string) || "");
  const { data: juegos, error } = useJuegos(fecha);

  if (error != null) return <div>Error cargando juegos...</div>;
  if (juegos == null) return <div>Cargando...</div>;

  return (
    <div>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          setFecha("");
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicFecha">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            placeholder="Fecha"
            name="fecha"
            value={fecha}
            required
            onChange={(e) => setFecha(e.target.value)}
          />
        </Form.Group>
      </Form>
      {user.role === "COORDINADOR" ? (
        <div className={styles.addButton}>
          <Link
            href={{
              pathname: "/juegos/create",
              query: { fecha },
            }}
          >
            <a title="Agregar juego">+</a>
          </Link>
        </div>
      ) : null}

      {!juegos.length ? (
        <Form.Text className="text-muted">
          No se encontraron juegos registrados para la fecha seleccionada.
        </Form.Text>
      ) : null}
      {juegos.map((juego) => (
        <JuegoItem juego={juego} user={user} key={juego.id} />
      ))}
    </div>
  );
};

const ArbitrosList: React.FC<{ arbitros: Arbitro[] }> = ({ arbitros }) => (
  <ListGroup>
    {arbitros.map((arbitro) => (
      <ListGroup.Item key={arbitro.id}>
        {arbitro.nombre} {arbitro.apellido}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

const JuegoItem: React.FC<{ juego: Juego; user: User }> = ({ juego, user }) => (
  <Card>
    <Card.Body>
      <Container>
        <Row>
          <Col>
            <Card.Subtitle>Estadio</Card.Subtitle>
            <Card.Text>{juego.estadio.nombre}</Card.Text>
          </Col>
          <Col>
            <Card.Subtitle>Categoría</Card.Subtitle>
            <Card.Text>{juego.categoriaJuego.nombre}</Card.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Subtitle>Estatus</Card.Subtitle>
            <Card.Text>{juego.estatus}</Card.Text>
          </Col>
          <Col>
            <Card.Subtitle>Hora</Card.Subtitle>
            <Card.Text>{getHoraJuego(juego.fecha)}</Card.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Subtitle>Árbitros</Card.Subtitle>
            {juego.arbitros.length ? (
              <ArbitrosList arbitros={juego.arbitros} />
            ) : (
              "Sin árbitros asignados"
            )}
          </Col>
        </Row>
      </Container>
      {user.role === "COORDINADOR" ? (
        <div className={styles.actions}>
          {juego.estatus == "PROGRAMADO" || juego.estatus == "SUSPENDIDO" ? (
            <Link
              href={{
                pathname: "/juegos/edit",
                query: { juegoId: juego.id },
              }}
            >
              <a>Editar</a>
            </Link>
          ) : (
            ""
          )}
          &nbsp;
          {juego.estatus == "PROGRAMADO" ? (
            <Link href="">
              <a onClick={(e) => handleDelete(juego)}>Eliminar</a>
            </Link>
          ) : (
            ""
          )}
          &nbsp;
          {juego.estatus == "PROGRAMADO" || juego.estatus == "SUSPENDIDO" ? (
            <Link
              href={{
                pathname: "/juegos/status",
                query: { juegoId: juego.id },
              }}
            >
              <a>Estatus</a>
            </Link>
          ) : (
            ""
          )}
        </div>
      ) : null}
    </Card.Body>
  </Card>
);

async function handleDelete(juego: Juego) {
  if (confirm("Esta seguro que desea eliminar el juego?") == true) {
    try {
      await deleteJuego(juego);
      alert("Juego eliminado!!!");
    } catch (error) {
      alert("Ocurrió un error al eliminar el juego");
    }
  }
}

function getHoraJuego(fecha) {
  const date = new Date(fecha);
  return date.toLocaleTimeString().substring(0, 5);
}

const Juegos = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <JuegoList user={user} />
      </main>
    </Layout>
  );
};

export default Juegos;

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
