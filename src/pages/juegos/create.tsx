import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import { useArbitros } from "../../api-arbitros";
import { useCategorias } from "../../api-categorias";
import { sessionOptions } from "../../lib/session";
import { JuegoCreateData } from "../../types";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { useEstadios } from "../../api-estadios";
import styles from "../../styles/Juegos.module.css";
import { createJuego } from "../../api-juegos";

export const JuegoCreateForm: React.FC = () => {
  const router = useRouter();
  let {
    query: { fecha },
  } = router;

  if (!fecha) {
    fecha = new Date().toISOString().substring(0, 16);
  } else {
    fecha = new Date(fecha as string).toISOString().substring(0, 16);
  }
  const [loading, setLoading] = React.useState(false);
  const [datos, setDatos] = React.useState<JuegoCreateData>({
    fecha,
    categoria: "",
    estadio: "",
    precio: null,
    arbitros: [],
  });

  const { data: arbitros, error: errorArbitros } = useArbitros();
  const { data: categorias, error: errorCategorias } = useCategorias();
  const { data: estadios, error: errorEstadios } = useEstadios();

  if (errorArbitros != null) return <div>Error cargando árbitros...</div>;
  if (errorCategorias != null) return <div>Error cargando categorías...</div>;
  if (errorEstadios != null) return <div>Error cargando estadios...</div>;
  if (arbitros == null || categorias == null || estadios == null)
    return <div>Cargando...</div>;

  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    setDatos({
      ...datos,
      [event.target.name]: option,
    });
  };

  const handleCategoriaSelectChange = (event) => {
    event.preventDefault();
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    if (!option) return;
    const categoria = categorias.find((categoria) => {
      return categoria.id === Number(option);
    });
    setDatos({
      ...datos,
      precio: Number(categoria.precio),
      [event.target.name]: Number(option),
    });
  };

  const handleArbitroSelectChange = (event) => {
    event.preventDefault();
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
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
      await createJuego(datos);
      setDatos({
        ...datos,
        categoria: "",
        estadio: "",
        precio: null,
        arbitros: [],
      });
      alert("Juego guardado!!!");
      event.target.reset();
    } catch (error) {
      alert("Ocurrió un error al guardar el juego");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Registrar juego</h2>
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
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {estadios.map((estadio) => (
            <option id={"" + estadio.id} key={estadio.id}>
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
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {categorias.map((categoria) => (
            <option id={"" + categoria.id} key={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <p>Asignar árbitros ahora o puede asignarlos más tarde</p>
        <label htmlFor="arbitro">Agregar árbitros</label>
        <select
          id="arbitro"
          name="arbitro"
          required
          onChange={handleArbitroSelectChange}
        >
          <option id={null} value="" key="">
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
        <button className={styles.addButton} disabled={loading}>Guardar</button>
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
