import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useArbitrosByActivo } from "../../api-arbitros";
import { useCategoriasByActivo } from "../../api-categorias";
import { sessionOptions } from "../../lib/session";
import { DuracionJuego, JuegoCreateData } from "../../types";
import { User } from "../api/user";
import Layout from "../../components/Layout";
import { useEstadiosByActivo } from "../../api-estadios";
import { createJuego } from "../../api-juegos";
import Form from "react-bootstrap/Form";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import { InferGetServerSidePropsType } from "next";

export const JuegoCreateForm: React.FC<{ user: User }> = ({ user }) => {
  if (user.role !== "PRESIDENTE" && user.role !== "COORDINADOR") {
    return <div>No tiene acceso a este modulo...</div>;
  }
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
    duracion: 0,
    categoria: "",
    estadio: "",
    precio: null,
    arbitros: [],
  });

  useEffect(() => {
    setDatos(datos);
  }, [datos]);

  const { data: arbitros, error: errorArbitros } = useArbitrosByActivo();
  const { data: categorias, error: errorCategorias } = useCategoriasByActivo();
  const { data: estadios, error: errorEstadios } = useEstadiosByActivo();

  if (errorArbitros != null) {
    if (errorArbitros.data && errorArbitros.data.status === "forbidden") {
      return <div>No tiene acceso a este modulo...</div>;
    }
    return <div>Error cargando árbitros...</div>;
  }
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
    const option = el.getAttribute("value") || "";
    setDatos({
      ...datos,
      [event.target.name]: option,
    });
  };

  const handleCategoriaSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("value") || "";
    if (!option) return;
    const categoria = categorias.find((categoria) => {
      return categoria.id === Number(option);
    });
    setDatos({
      ...datos,
      precio: Number(categoria.precio),
      [event.target.name]: option,
    });
  };

  const handleArbitroSelectChange = (event) => {
    const index = event.target.selectedIndex;
    const el = event.target.childNodes[index];
    const option = el.getAttribute("id");
    if (!option) return;
    const optionToNumber = Number(option);
    const arbitroFound = datos.arbitros.find((arbitro) => {
      return arbitro.id === optionToNumber;
    });
    if (arbitroFound) return;
    const arbitro = arbitros.find((arbitro) => {
      return arbitro.id === optionToNumber;
    });
    datos.arbitros.push(arbitro);
    setDatos({
      ...datos,
      [event.target.name]: optionToNumber,
    });
  };

  const eliminarArbitro = (id) => {
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
        duracion: 0,
        categoria: "",
        estadio: "",
        precio: null,
        arbitros: [],
      });
      alert("Juego guardado!!!");
      event.target.reset();
    } catch (error) {
      if (error.data && error.data.message) {
        alert(error.data.message);
      } else {
        alert("Ocurrió un error al guardar el juego");
      }
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Crear juego</h4>
      <Form.Group className="mb-3" controlId="formBasicFecha">
        <Form.Label>Fecha y hora</Form.Label>
        <Form.Control
          type="datetime-local"
          placeholder="Fecha y hora"
          name="fecha"
          value={datos.fecha}
          required
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicDuracion">
        <Form.Label>Duracion</Form.Label>
        <Form.Select
          name="duracion"
          required
          value={datos.duracion}
          onChange={handleSelectChange}
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {DuracionJuego.map((opt) => (
            <option value={"" + opt.minutos} key={opt.minutos}>
              {opt.text}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEstadio">
        <Form.Label>Estadio</Form.Label>
        <Form.Select
          name="estadio"
          required
          value={datos.estadio}
          onChange={handleSelectChange}
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {estadios.map((estadio) => (
            <option value={"" + estadio.id} key={estadio.id}>
              {estadio.nombre}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCategoria">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
          name="categoria"
          aria-label="Default select example"
          required
          value={datos.categoria}
          onChange={handleCategoriaSelectChange}
        >
          <option id={null} value="" key="">
            Seleccione
          </option>
          {categorias.map((categoria) => (
            <option value={"" + categoria.id} key={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicArbitro">
        <Form.Label>Agregar árbitros</Form.Label>
        <Form.Select
          name="arbitro"
          aria-label="Default select example"
          required
          onChange={handleArbitroSelectChange}
        >
          <option value={""} key="">
            Seleccione
          </option>
          {arbitros.map((arbitro) => (
            <option id={"" + arbitro.id} key={arbitro.id}>
              {arbitro.nombre} {arbitro.apellido}
            </option>
          ))}
        </Form.Select>
        <Form.Text className="text-muted">
          También puedes asignar los árbitros el dia de la coordinación.
        </Form.Text>
      </Form.Group>
      {datos.arbitros.length ? (
        <ListGroup>
          {datos.arbitros.map((arbitro) => (
            <ListGroup.Item key={arbitro.id}>
              {arbitro.nombre} {arbitro.apellido}
              <Button
                style={{ float: "right" }}
                variant="secondary"
                type="button"
                onClick={(event) => eliminarArbitro(arbitro.id)}
              >
                Eliminar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Form.Text className="text-muted">
          No hay árbitros seleccionados.
        </Form.Text>
      )}
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

const Juegos = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <main>
        <JuegoCreateForm user={user} />
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
