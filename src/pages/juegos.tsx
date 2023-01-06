import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { deleteJuego, useJuegos } from "../api-juegos";
import Layout from "../components/Layout";
import { sessionOptions } from "../lib/session";
import styles from "../styles/Juegos.module.css";
import { Arbitro, Juego } from "../types";
import { User } from "./api/user";

export const JuegoList: React.FC = () => {
  const router = useRouter();
  let {
    query: { fecha: fechaToFilter },
  } = router;

  const [fecha, setFecha] = useState((fechaToFilter as string) || "");
  const { data: juegos, error } = useJuegos(fecha);

  if (error != null) return <div>Error cargando juegos...</div>;
  if (juegos == null) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setFecha("");
        }}
      >
        <input
          type="date"
          placeholder="Fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </form>
      {juegos.length ? (
        <Link
          href={{
            pathname: "/juegos/create",
            query: { fecha },
          }}
        >
          <a>Agregar Juego</a>
        </Link>
      ) : null}

      <div className={styles.juegosGrid + " " + styles.gridHeader}>
        <label>Estadio</label>
        <label>Hora</label>
        <label>Categoría</label>
        <label>Árbitros</label>
        <label>Estatus</label>
      </div>
      {juegos.map((juego) => (
        <JuegoItem juego={juego} key={juego.id} />
      ))}
    </div>
  );
};

const ArbitrosList: React.FC<{ arbitros: Arbitro[] }> = ({ arbitros }) => (
  <ul>
    {arbitros.map((arbitro) => (
      <li key={arbitro.id}>
        {arbitro.nombre} {arbitro.apellido}
      </li>
    ))}
  </ul>
);

const JuegoItem: React.FC<{ juego: Juego }> = ({ juego }) => (
  <div className={styles.juegosGrid}>
    <div className={styles.gridCell} data-name="Estadio: ">
      {juego.estadio.nombre}
    </div>
    <div className={styles.gridCell} data-name="Hora: ">
      {getHoraJuego(juego.hora)}
    </div>
    <div className={styles.gridCell} data-name="Categoría: ">
      {juego.categoriaJuego.nombre}
    </div>
    <div className={styles.gridCell} data-name="Árbitros: ">
      {juego.arbitros.length ? (
        <ArbitrosList arbitros={juego.arbitros} />
      ) : (
        "Sin árbitros asignados"
      )}
    </div>
    <div className={styles.gridCell} data-name="Estatus: ">
      {juego.estatus}
    </div>
    <div className={styles.gridCell}>
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
    </div>
  </div>
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

function getHoraJuego(hora) {
  const date = new Date(hora);
  return `${date.getHours()}:${date.getMinutes()}`;
}

const Juegos = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <JuegoList />
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
