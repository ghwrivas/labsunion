import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row,
  Spinner,
} from "react-bootstrap";
import { createAbonos } from "../api-abonos";
import { useArbitrosByActivo } from "../api-arbitros";
import { useCuentasCobrarByUsuarioId } from "../api-cuentas-cobrar";
import Layout from "../components/Layout";
import { sessionOptions } from "../lib/session";
import {
  CuentaCobrar,
  EstatusCuentaCobrar,
  TipoCuentaCobrar,
  AbonoCreateData,
} from "../types";
import { User } from "./api/user";

export const CuentasCobrarList: React.FC<{ user: User }> = ({ user }) => {
  if (user.role !== "PRESIDENTE" && user.role !== "TESORERO") {
    return <div>No tiene acceso a este modulo...</div>;
  }
  const [arbitroId, setArbitroId] = useState("0");
  const [loading, setLoading] = useState(false);
  const [montoTotalCuentasCobrar, setMontoTotalCuentasCobrar] = useState(0);
  const [montoTotalAbonar, setMontoTotalAbonar] = useState(0);
  const [abonoCreateData, setAbonoCreateData] = useState(
    [] as AbonoCreateData[]
  );
  const { data: arbitros, error: errorArbitros } = useArbitrosByActivo();
  const { data: cuentasCobrar, error } = useCuentasCobrarByUsuarioId(arbitroId);

  useEffect(() => {
    setMontoTotalAbonar(montoTotalAbonar);
  }, [montoTotalAbonar]);

  useEffect(() => {
    setArbitroId(arbitroId);
  }, [arbitroId]);

  useEffect(() => {
    setAbonoCreateData(abonoCreateData);
  }, [abonoCreateData]);

  useEffect(() => {
    if (cuentasCobrar && cuentasCobrar.length) {
      let totalCuentasCobrar = 0;
      cuentasCobrar.forEach((cuentaCobrar) => {
        if (
          cuentaCobrar.estatus === EstatusCuentaCobrar.PENDIENTE.toUpperCase()
        ) {
          totalCuentasCobrar += cuentaCobrar.monto;
        }
      });
      setMontoTotalCuentasCobrar(totalCuentasCobrar);
    }
  }, [montoTotalCuentasCobrar, cuentasCobrar]);

  if (errorArbitros != null) {
    if (errorArbitros.data && errorArbitros.data.status === "forbidden") {
      return <div>No tiene acceso a este modulo...</div>;
    }
    return <div>Error cargando árbitros...</div>;
  }
  if (error != null) {
    if (error.data && error.data.status === "forbidden") {
      return <div>No tiene acceso a este modulo...</div>;
    }
    return <div>Error cargando cuentas por cobrar...</div>;
  }
  if (cuentasCobrar == null || arbitros == null) return <div>Cargando...</div>;

  const handleArbitroSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("value") || "";
    setArbitroId(option);
    setMontoTotalAbonar(0);
    setAbonoCreateData([]);
    setMontoTotalCuentasCobrar(0);
  };

  const handleCuentaCobrarChecked = (e, cuentaCobrar: CuentaCobrar) => {
    const checked = e.target.checked;
    if (checked) {
      setMontoTotalAbonar(montoTotalAbonar + cuentaCobrar.monto);
      abonoCreateData.push({
        cuentaCobrarId: cuentaCobrar.id,
        monto: cuentaCobrar.monto,
        tipo: cuentaCobrar.tipo,
      });
      setAbonoCreateData(abonoCreateData);
    } else {
      setMontoTotalAbonar(montoTotalAbonar - cuentaCobrar.monto);
      let newAbonoCreateData = abonoCreateData.filter((abono) => {
        return abono.cuentaCobrarId !== cuentaCobrar.id;
      });
      setAbonoCreateData(newAbonoCreateData);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createAbonos(abonoCreateData);
      setArbitroId("0");
      setMontoTotalAbonar(0);
      setAbonoCreateData([]);
      setMontoTotalCuentasCobrar(0);
      alert("Pago registrado!!!");
    } catch (error) {
      alert("Ocurrió un error al registrar el pago");
    }
    setLoading(false);
  };

  return (
    <div>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <h4>Registrar pago</h4>
        <Form.Group className="mb-3" controlId="formBasicArbitro">
          <Form.Label>Seleccionar árbitro</Form.Label>
          <Form.Select
            name="arbitro"
            aria-label="Default select example"
            required
            value={arbitroId}
            onChange={handleArbitroSelectChange}
          >
            <option value={""} key="">
              Seleccione
            </option>
            {arbitros.map((arbitro) => (
              <option value={"" + arbitro.id} key={arbitro.id}>
                {`${arbitro.nombre} ${arbitro.apellido}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
      {!cuentasCobrar.length ? (
        <Form.Text className="text-muted">
          No se encontraron cuentas por cobrar para el árbitro seleccionado.
        </Form.Text>
      ) : (
        <>
          <Card>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <Card.Subtitle>Total deuda</Card.Subtitle>
                    <Card.Text style={{ fontSize: "30px" }}>
                      $ {montoTotalCuentasCobrar.toFixed(2)}
                    </Card.Text>
                  </Col>
                  <Col>
                    <Card.Subtitle>Abonando</Card.Subtitle>
                    <Card.Text style={{ fontSize: "30px" }}>
                      $ {montoTotalAbonar.toFixed(2)}
                    </Card.Text>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          <br></br>
          <h6>Cuentas por cobrar</h6>
          <Form onSubmit={handleSubmit}>
            {cuentasCobrar.map((cuentaCobrar) => {
              return (
                <CuentaCobrarItem
                  cuentaCobrar={cuentaCobrar}
                  user={user}
                  key={cuentaCobrar.id}
                  handleMontoTotalAbonar={handleCuentaCobrarChecked}
                />
              );
            })}
            <br></br>
            <div
              className="mx-auto .mt-1"
              style={{ width: "200px", marginBottom: "20px" }}
            >
              <Button
                style={{ width: "200px" }}
                variant="primary"
                type="submit"
                disabled={loading || montoTotalAbonar <= 0}
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
        </>
      )}
    </div>
  );
};

const getFormatedDate = (fecha: string) => {
  return fecha.substring(0, 10);
};

const getFormatedHour = (fecha: string) => {
  return fecha.substring(11, 16);
};

const CuentaCobrarItem: React.FC<{
  cuentaCobrar: CuentaCobrar;
  user: User;
  handleMontoTotalAbonar: Function;
}> = ({ cuentaCobrar, user, handleMontoTotalAbonar }) => (
  <Card>
    <Card.Body>
      <Container>
        {cuentaCobrar.estatus.toUpperCase() == "PENDIENTE" ? (
          <Row>
            <Col>
              <Form.Check
                id={String(cuentaCobrar.id)}
                reverse
                disabled={cuentaCobrar.estatus.toUpperCase() == "PAGADO"}
                aria-label=""
                onClick={(e) => {
                  handleMontoTotalAbonar(e, cuentaCobrar);
                }}
              />
            </Col>
          </Row>
        ) : null}
        <Row>
          <Col>
            <Card.Subtitle>Monto</Card.Subtitle>
            <Card.Text>$ {cuentaCobrar.monto}</Card.Text>
          </Col>
          <Col>
            <Card.Subtitle>Estatus</Card.Subtitle>
            <Card.Text>{EstatusCuentaCobrar[cuentaCobrar.estatus]}</Card.Text>
          </Col>
          <Col>
            <Card.Subtitle>Tipo</Card.Subtitle>
            <Card.Text>{TipoCuentaCobrar[cuentaCobrar.tipo]}</Card.Text>
          </Col>
        </Row>
        {cuentaCobrar.juego ? (
          <OverlayTrigger
            trigger="click"
            placement="auto"
            overlay={
              <Popover id="popover-basic">
                <Popover.Header as="h3">Datos del juego</Popover.Header>
                <Popover.Body>
                  <Container>
                    <Row>
                      <Col>
                        <Card.Subtitle>Estadio</Card.Subtitle>
                        <Card.Text>{cuentaCobrar.juego.estadio}</Card.Text>
                      </Col>
                      <Col>
                        <Card.Subtitle>Categoría</Card.Subtitle>
                        <Card.Text>{cuentaCobrar.juego.categoria}</Card.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Card.Subtitle>Fecha</Card.Subtitle>
                        <Card.Text>
                          {getFormatedDate(cuentaCobrar.juego.fecha)}
                        </Card.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Card.Subtitle>Hora</Card.Subtitle>
                        <Card.Text>
                          {getFormatedHour(cuentaCobrar.juego.fecha)}
                        </Card.Text>
                      </Col>
                    </Row>
                  </Container>
                </Popover.Body>
              </Popover>
            }
          >
            <Button style={{ float: "right" }} variant="link">
              Datos del juego
            </Button>
          </OverlayTrigger>
        ) : null}
      </Container>
    </Card.Body>
  </Card>
);

const CuentasCobrar = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <CuentasCobrarList user={user} />
      </main>
    </Layout>
  );
};

export default CuentasCobrar;

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
