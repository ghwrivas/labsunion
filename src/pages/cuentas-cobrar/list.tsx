import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useCuentasCobrar } from "../../api-cuentas-cobrar";
import Layout from "../../components/Layout";
import { sessionOptions } from "../../lib/session";
import { CuentaCobrarArbitro } from "../../types";
import { User } from "../api/user";

export const CuentasCobrarList: React.FC<{ user: User }> = ({ user }) => {
  if (user.role !== "PRESIDENTE" && user.role !== "TESORERO") {
    return <div>No tiene acceso a este modulo...</div>;
  }
  const [montoTotalPagado, setMontoTotalPagado] = useState(0);
  const [montoTotalPendiente, setMontoTotalPendiente] = useState(0);

  const { data: cuentasCobrar, error } = useCuentasCobrar();

  useEffect(() => {
    if (cuentasCobrar && cuentasCobrar.length) {
      let montoTotalPagadoTemp = 0;
      let montoTotalPendienteTemp = 0;
      cuentasCobrar.forEach((cuentaCobrar) => {
        montoTotalPagadoTemp += cuentaCobrar.montoPagado;
        montoTotalPendienteTemp += cuentaCobrar.montoPendiente;
      });
      setMontoTotalPagado(montoTotalPagadoTemp);
      setMontoTotalPendiente(montoTotalPendienteTemp);
    }
  }, [cuentasCobrar]);

  if (error != null) {
    if (error.data && error.data.status === "forbidden") {
      return <div>No tiene acceso a este modulo...</div>;
    }
    return <div>Error cargando cuentas por cobrar...</div>;
  }

  if (cuentasCobrar == null) return <div>Cargando...</div>;

  return (
    <div>
      <h4>Cuentas por cobrar</h4>
      {!cuentasCobrar.length ? (
        <Form.Text className="text-muted">
          No se encontraron cuentas por cobrar.
        </Form.Text>
      ) : (
        <>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Árbitro</th>
                <th>Pagado</th>
                <th>Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {cuentasCobrar.map((cuentaCobrar) => {
                return (
                  <CuentaCobrarItem
                    cuentaCobrar={cuentaCobrar}
                    user={user}
                    key={cuentaCobrar.id}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Totales</th>
                <th>{montoTotalPagado.toFixed(2)}</th>
                <th>{montoTotalPendiente.toFixed(2)}</th>
              </tr>
            </tfoot>
          </Table>
        </>
      )}
    </div>
  );
};

const CuentaCobrarItem: React.FC<{
  cuentaCobrar: CuentaCobrarArbitro;
  user: User;
}> = ({ cuentaCobrar, user }) => (
  <tr>
    <td>
      {cuentaCobrar.nombre} {cuentaCobrar.apellido}
    </td>
    <td>$ {cuentaCobrar.montoPagado}</td>
    <td>$ {cuentaCobrar.montoPendiente}</td>
  </tr>
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
