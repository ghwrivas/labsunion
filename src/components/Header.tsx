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
  return user?.isLoggedIn ? (
    <header>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">LABSUNION</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user.role === "COORDINADOR" || user.role === "PRESIDENTE" ? (
                <NavDropdown title="Coordinación" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/juegos">
                    Buscar juegos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/juegos/create">
                    Crear juego
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
              {user.role === "TESORERO" || user.role === "PRESIDENTE" ? (
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
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href="/arbitros">Árbitros</NavDropdown.Item>
                <NavDropdown.Item href="/estadios">Estadios</NavDropdown.Item>
                <NavDropdown.Item href="/categorias">
                  Categorías
                </NavDropdown.Item>
              </NavDropdown>
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
                    router.push("/");
                  }}
                >
                  Salir
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  ) : (
    <header>
      <Navbar
        expand="lg"
        bg="dark"
        variant="dark"
        className={router.pathname !== "/login" ? "fixed-top" : ""}
      >
        <Container>
          <Navbar.Brand href={router.pathname === "/login" ? "/" : "#home"}>
            LABSUNION
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#pricing" className="text-end">
                Precios
              </Nav.Link>
              <Nav.Link href="#team" className="text-end">
                Árbitros
              </Nav.Link>
              <Nav.Link href="/login" className="text-end">
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
