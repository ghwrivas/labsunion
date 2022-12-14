import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useArbitros } from "../../api-arbitros";
import { useCategorias } from "../../api-categorias";
import { sessionOptions } from "../../lib/session";
import { JuegoEditData } from "../../types";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { useEstadios } from "../../api-estadios";
import styles from "../../styles/Juegos.module.css";
import { editJuego, findJuego } from "../../api-juegos";
import Link from "next/link";

export const JuegoCreateForm: React.FC = () => {
  const router = useRouter();
  let {
    query: { juegoId },
  } = router;

  const [loading, setLoading] = React.useState(false);
  const [loadingJuego, setLoadingJuego] = React.useState(true);
  const [errorLoadingJuego, setErrorLoadingJuego] = React.useState(false);
  const [datos, setDatos] = React.useState<JuegoEditData>({
    id: "",
    fecha: "",
    categoria: "",
    estadio: "",
    precio: null,
    arbitros: [],
  });
  const getJuego = async () => {
    try {
      const juego = await findJuego(juegoId as string);
      setDatos({
        id: juegoId as string,
        fecha: new Date(juego.fecha as string).toISOString().substring(0, 16),
        categoria: String(juego.categoriaJuego.id),
        estadio: String(juego.estadio.id),
        precio: juego.precio,
        arbitros: juego.arbitros,
      });
    } catch (error) {
      setErrorLoadingJuego(true);
    }
    setLoadingJuego(false);
  };
  useEffect(() => {
    getJuego();
  }, []);
  const { data: arbitros, error: errorArbitros } = useArbitros();
  const { data: categorias, error: errorCategorias } = useCategorias();
  const { data: estadios, error: errorEstadios } = useEstadios();

  if (errorLoadingJuego) return <div>Error cargando juego...</div>;
  if (errorArbitros != null) return <div>Error cargando árbitros...</div>;
  if (errorCategorias != null) return <div>Error cargando categorías...</div>;
  if (errorEstadios != null) return <div>Error cargando estadios...</div>;

  if (
    loadingJuego == true ||
    arbitros == null ||
    categorias == null ||
    estadios == null
  )
    return <div>Cargando...</div>;

  console.log("datos", JSON.stringify(datos));

  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
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

  const handleCategoriaSelectChange = (event) => {
    event.preventDefault();
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("value") || "";
    let precio = 0;
    if (option !== "") {
      const categoria = categorias.find((categoria) => {
        return categoria.id === Number(option);
      });
      precio = Number(categoria.precio);
    }
    setDatos({
      ...datos,
      precio,
      [event.target.name]: option,
    });
  };

  const handleArbitroSelectChange = (event) => {
    event.preventDefault();
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    console.log(option);
    if (!option) return;
    const arbitroFound = datos.arbitros.find((arbitro) => {
      return arbitro.id === Number(option);
    });
    if (arbitroFound) return;
    const arbitro = arbitros.find((arbitro) => {
      return arbitro.id === Number(option);
    });
    datos.arbitros.push(arbitro);
    setDatos({
      ...datos,
      [event.target.name]: Number(option),
    });
  };

  const eliminarArbitro = (id, event) => {
    event.preventDefault();
    const arbitros = datos.arbitros.filter((arbitro) => {
      return arbitro.id !== id;
    });
    datos.arbitros = arbitros;
    setDatos({
      ...datos,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await editJuego(datos);
      alert("Juego guardado!!!");
      event.target.reset();
    } catch (error) {
      alert("Ocurrió un error al guardar el juego");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Editar juego</h2>
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
        <input
          id="fecha"
          name="fecha"
          type="datetime-local"
          placeholder="Fecha"
          value={datos.fecha}
          required
          onChange={handleInputChange}
        />
        <label htmlFor="estadio">Estadio</label>
        <select
          id="estadio"
          name="estadio"
          required
          placeholder="Seleccione el estadio"
          onChange={handleSelectChange}
          value={datos.estadio}
        >
          <option value={""} key="">
            Seleccione
          </option>
          {estadios.map((estadio) => (
            <option value={"" + estadio.id} key={estadio.id}>
              {estadio.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          name="categoria"
          required
          onChange={handleCategoriaSelectChange}
          value={datos.categoria}
        >
          <option value={""} key="">
            Seleccione
          </option>
          {categorias.map((categoria) => (
            <option value={"" + categoria.id} key={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="arbitro">Agregar árbitros</label>
        <select
          id="arbitro"
          name="arbitro"
          required
          onChange={handleArbitroSelectChange}
        >
          <option value={""} key="">
            Seleccione
          </option>
          {arbitros.map((arbitro) => (
            <option id={"" + arbitro.id} key={arbitro.id}>
              {arbitro.nombre}
            </option>
          ))}
        </select>
        {datos.arbitros.length ? (
          <div className={styles.arbitrosList}>
            {datos.arbitros.map((arbitro) => (
              <div className={styles.arbitroItem} key={arbitro.id}>
                <span>
                  {arbitro.nombre} {arbitro.apellido}
                </span>
                <button onClick={(event) => eliminarArbitro(arbitro.id, event)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          "Sin árbitros asignados"
        )}
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
          <JuegoCreateForm key="form" />
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
