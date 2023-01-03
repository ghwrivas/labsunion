import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { sessionOptions } from "../../lib/session";
import { EstatusJuego, JuegoEditData } from "../../types";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import styles from "../../styles/Juegos.module.css";
import { changeStatus, findJuego } from "../../api-juegos";
import Link from "next/link";

export const ChangeStatusForm: React.FC = () => {
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
    categoria: "",
    estadio: "",
    estatus: "",
    precio: null,
    arbitros: [],
  });
  const getJuego = async () => {
    try {
      const juego = await findJuego(juegoId as string);
      setDatos({
        id: juegoId as string,
        fecha: new Date(juego.fecha as string).toISOString().substring(0, 16),
        categoria: String(juego.categoriaJuego.nombre),
        estadio: String(juego.estadio.nombre),
        estatus: juego.estatus,
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

  if (errorLoadingJuego) return <div>Error cargando juego...</div>;

  if (loadingJuego == true) return <div>Cargando...</div>;

  console.log("datos", JSON.stringify(datos));

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
    <div>
      <h2>Actualizar estatus</h2>
      <Link
        href={{
          pathname: "/juegos",
          query: { fecha: datos.fecha.substring(0, 10) },
        }}
      >
        <a>Volver</a>
      </Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fecha">Fecha y hora</label>
        <span className={styles.info}>{datos.fecha}</span>
        <br></br>
        <label htmlFor="estadio">Estadio</label>
        <span>{datos.estadio}</span>
        <br></br>
        <label htmlFor="categoria">Categoría</label>
        <span>{datos.categoria}</span>
        <br></br>
        <label htmlFor="arbitro">Árbitros</label>
        {datos.arbitros.length ? (
          <div>
            {datos.arbitros.map((arbitro) => (
              <div className={styles.arbitroItem} key={arbitro.id}>
                <span>
                  {arbitro.nombre} {arbitro.apellido}
                </span>
              </div>
            ))}
          </div>
        ) : (
          "Sin árbitros asignados"
        )}
        <br></br>
        <label htmlFor="estatus-actual">Estatus Actual</label>
        <span>{currentStatus}</span>
        <br></br>
        <label htmlFor="estatus">Nuevo estatus</label>
        <select
          id="estatus"
          name="estatus"
          required
          placeholder="Seleccione el estatus"
          onChange={handleSelectChange}
          value={datos.estatus}
        >
          <option value={""} key="">
            Seleccione
          </option>
          {Object.keys(EstatusJuego)
            .filter((estatus) => estatus !== "PROGRAMADO")
            .map((estatus) => (
              <option value={estatus} key={estatus}>
                {estatus}
              </option>
            ))}
        </select>
        <button className={styles.addButton} disabled={loading}>
          Guardar
        </button>
      </form>
    </div>
  );
};

const Juegos = () => {
  return (
    <Layout>
      <div className="container-form">
        <main>
          <ChangeStatusForm key="form" />
        </main>
      </div>
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
