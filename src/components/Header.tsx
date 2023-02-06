import useUser from "../lib/useUser";
import { useRouter } from "next/router";
import fetchJson from "../lib/fetchJson";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Header() {
  const { user, mutateUser } = useUser();
  const router = useRouter();

  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">LABSUNION</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              <NavDropdown title="Coordinación" id="basic-nav-dropdown">
                <NavDropdown.Item href="/juegos">
                  Buscar juegos
                </NavDropdown.Item>
                {user?.isLoggedIn &&
                (user.role === "COORDINADOR" || user.role === "PRESIDENTE") ? (
                  <NavDropdown.Item href="/juegos/create">
                    Crear juego
                  </NavDropdown.Item>
                ) : null}
              </NavDropdown>
              {user?.isLoggedIn &&
              (user.role === "TESORERO" || user.role === "PRESIDENTE") ? (
                <NavDropdown title="Finanza" id="basic-nav-dropdown">
                  <>
                    <NavDropdown.Item href="/movimientos">
                      Movimientos
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/cuentas-cobrar">
                      Registrar pago
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/cuentas-cobrar/create">
                      Registrar cuenta por cobrar
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/gastos">
                      Registrar gasto
                    </NavDropdown.Item>
                  </>
                </NavDropdown>
              ) : null}
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href="/arbitros">Árbitros</NavDropdown.Item>
                <NavDropdown.Item href="/estadios">Estadios</NavDropdown.Item>
                <NavDropdown.Item href="/categorias">
                  Categorías
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            {user?.isLoggedIn === false && (
              <Nav.Link href="/login" className="text-end">
                Iniciar Sesión
              </Nav.Link>
            )}
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            {user?.isLoggedIn === true && (
              <Nav>
                <NavDropdown title={user.nombre} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/change-password">
                    Cambiar contraseña
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            {user?.isLoggedIn === true && (
              <Nav.Link
                href="/api/logout"
                className="text-end"
                onClick={async (e) => {
                  e.preventDefault();
                  mutateUser(
                    await fetchJson("/api/logout", { method: "POST" }),
                    false
                  );
                  router.push("/login");
                }}
              >
                Salir
              </Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br></br>
    </header>
  );
}
