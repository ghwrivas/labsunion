import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { sessionOptions } from "../../lib/session";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { useMovimientos } from "../../api-movimientos";
import { Card, Col, Container, Row } from "react-bootstrap";
import { getFormattedDate, getWeekDay } from "../../date-util";

export const MovimientosList: React.FC<{ user: User }> = ({ user }) => {
  const { data: result, error } = useMovimientos();

  if (error != null) return <div>Error cargando movimientos...</div>;
  if (result == null) return <div>Cargando...</div>;

  return (
    <>
      <Card>
        <Card.Body>
          <Container>
            <Row>
              <Col xs={9} md={8}>
                <Card.Text>Saldo</Card.Text>
              </Col>
              <Col xs={3} md={4}>
                <Card.Text style={{ textAlign: "right", fontWeight: "bold" }}>
                  {`$ ${result.saldo}`}
                </Card.Text>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      <br></br>
      <h6>Movimientos</h6>
      <div>
        {Object.keys(result.movimientos).map((fecha) => (
          <>
            <Card.Subtitle>
              {getFormattedDate(fecha.substring(0, 10))}
            </Card.Subtitle>
            <Card.Text>{getWeekDay(fecha.substring(0, 10))}</Card.Text>
            {result.movimientos[fecha].map((movimiento) => (
              <Card style={{ fontSize: "small" }} key={movimiento.id}>
                <Card.Body>
                  <Container>
                    <Row>
                      <Col xs={9} md={8}>
                        <Card.Text>{movimiento.descripcion}</Card.Text>
                      </Col>
                      <Col xs={3} md={4}>
                        <Card.Text
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {movimiento.tipo == "GASTO"
                            ? `- $ ${movimiento.monto}`
                            : `+ $ ${movimiento.monto}`}
                        </Card.Text>
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            ))}
            <br></br>
          </>
        ))}
      </div>
    </>
  );
};

const Movimientos = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <MovimientosList user={user} />
      </main>
    </Layout>
  );
};

export default Movimientos;

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
