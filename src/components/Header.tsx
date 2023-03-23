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
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">LABSUNION</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              {user?.isLoggedIn &&
              (user.role === "COORDINADOR" || user.role === "PRESIDENTE") ? (
                <NavDropdown title="Coordinación" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/juegos">
                    Buscar juegos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/juegos/create">
                    Crear juego
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
              {user?.isLoggedIn &&
              (user.role === "TESORERO" || user.role === "PRESIDENTE") ? (
                <NavDropdown title="Finanza" id="basic-nav-dropdown">
                  <>
                    <NavDropdown.Item href="/movimientos">
                      Movimientos
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/cuentas-cobrar/list">
                      Ver cuentas por cobrar
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
              {user?.isLoggedIn === true && (
                <NavDropdown title="Admin" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/arbitros">Árbitros</NavDropdown.Item>
                  <NavDropdown.Item href="/estadios">Estadios</NavDropdown.Item>
                  <NavDropdown.Item href="/categorias">
                    Categorías
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {user?.isLoggedIn === true && (
                <NavDropdown title={user.nombre} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/change-password">
                    Cambiar contraseña
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/api/logout"
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
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {user?.isLoggedIn === false && (
                <Nav.Link href="/login" className="text-end">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
