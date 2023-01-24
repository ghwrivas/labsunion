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
                <NavDropdown.Item href="/juegos/create">
                  Crear juego
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Finanza" id="basic-nav-dropdown">
                <NavDropdown.Item href="/cuentas-cobrar">
                  Registrar pago
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href="/arbitros">Árbitros</NavDropdown.Item>
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
                Cerrar Sesión
              </Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br></br>
    </header>
  );
}
