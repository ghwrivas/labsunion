import { InferGetServerSidePropsType } from "next";
import { User } from "../api/user";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import Layout from "../../components/Layout";
import React, { useEffect } from "react";
import { CuentaCobrarCreateData, TipoCuentaCobrar } from "../../types";
import { Button, Form, Spinner } from "react-bootstrap";
import { useArbitros } from "../../api-arbitros";
import { createCuentaPorCobrar } from "../../api-cuentas-cobrar";

export const CuentasCobrarCreateForm: React.FC<{ user: User }> = ({ user }) => {
  if (user.role !== "PRESIDENTE" && user.role !== "TESORERO") {
    return <div>No tiene acceso a este modulo...</div>;
  }
  const [loading, setLoading] = React.useState(false);
  const [datos, setDatos] = React.useState<CuentaCobrarCreateData>({
    monto: 0,
    descripcion: "",
    usuarioId: "",
    tipo: TipoCuentaCobrar.VENTA_DE_ARTICULO,
  });

  useEffect(() => {
    setDatos(datos);
    console.log(datos);
  }, [datos]);

  const { data: arbitros, error } = useArbitros();

  if (error != null) {
    return <div>Error cargando árbitros...</div>;
  }
  if (arbitros == null) return <div>Cargando...</div>;

  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };

  const handleInputSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("value") || "";
    if (!option) return;
    setDatos({
      ...datos,
      [event.target.name]: option,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createCuentaPorCobrar(datos);
      setDatos({
        ...datos,
        monto: 0,
        descripcion: "",
        usuarioId: "",
        tipo: TipoCuentaCobrar.VENTA_DE_ARTICULO,
      });
      alert("Cuenta por cobrar guardada!!!");
      event.target.reset();
    } catch (error) {
      alert("Ocurrió un error al guardar la cunta por cobrar");
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Registrar cuenta por cobrar</h4>
      <Form.Group className="mb-3" controlId="formBasicArbitro">
        <Form.Label>Árbitro</Form.Label>
        <Form.Select
          name="usuarioId"
          aria-label="Default select example"
          required
          value={datos.usuarioId}
          onChange={handleInputSelectChange}
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {arbitros.map((arbitro) => (
            <option value={"" + arbitro.id} key={arbitro.id}>
              {arbitro.nombre} {arbitro.apellido}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
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
          El monto de la cuenta por cobrar.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicTipo">
        <Form.Label>Tipo</Form.Label>
        <Form.Select
          name="tipo"
          aria-label="Default select example"
          required
          value={datos.tipo}
          onChange={handleInputSelectChange}
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {Object.keys(TipoCuentaCobrar).map((tipo) => (
            <option value={"" + tipo} key={tipo}>
              {tipo}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicDescripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          rows={3}
          maxLength={100}
          placeholder="Ej: Venta de camisa"
          name="descripcion"
          value={datos.descripcion}
          required
          onChange={handleInputChange}
        />
        <Form.Text className="text-muted">Ej: Venta de camisa, otro</Form.Text>
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

const CuentasCobrar = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <CuentasCobrarCreateForm user={user} />
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
