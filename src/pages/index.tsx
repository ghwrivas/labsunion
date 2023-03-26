import { NextPage } from "next";
import LayoutHome from "../components/LayoutHome";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <LayoutHome>
      <div id="home">
        <div className={styles.landing}>
          <div className={styles.homewrap}>
            <div className={styles.homeinner}></div>
          </div>
        </div>

        <div
          className={`${styles.caption} text-center text-light text-uppercase`}
        >
          <h1
            className="font-weight-bold os-animation"
            data-animation="bounceInUp"
            data-delay=".6s"
          >
            ÁRBITROS<span className={styles.textunion}>UNIÓN</span>
          </h1>
          <h3
            className="font-weight-bold os-animation"
            data-animation="bounceInUp"
            data-delay=".8s"
          >
            BEISBOL Y SOFTBALL
          </h3>
          <a
            href="#pricing"
            className="btn btn-outline-light btn-lg rounded-0 os-animation"
            data-animation="bounceInUp"
            data-delay="1s"
          >
            Precios
          </a>
        </div>
      </div>

      <div id="pricing" className="offset">
        <div className="jumbotron mb-0">
          <div className="container py-2">
            <div className="os-animation" data-animation="fadeInUp">
              <h3 className={styles.heading}>Precios</h3>
              <div className={styles.headingunderline}></div>
            </div>
            <div className="row justify-content-center text-center px-lg-4 px-xl-5">
              <div
                className="col-md-6 col-lg-4 os-animation"
                data-animation="fadeInLeft"
              >
                <div className={styles.pricingcolumn}>
                  <h3 className="border-bottom py-2 mx-3">Beisbol Menor</h3>
                  <p className="lead py-2">
                    Todas las categorías del beisbol menor.
                  </p>
                  <p className="lead py-2">Precios desde</p>
                  <h1 className="py-3">$8</h1>
                  <a
                    href="#contact"
                    className={`btn btn-secondary btn-sm ${styles.btnsm}`}
                  >
                    Contratar
                  </a>
                </div>
              </div>
              <div
                className="col-md-6 col-lg-4 os-animation"
                data-animation="fadeInUp"
              >
                <div className={styles.pricingcolumn}>
                  <h3 className="border-bottom py-2 mx-3">Softball</h3>
                  <p className="lead py-2">
                    Todas las modalidades del softball.
                  </p>
                  <p className="lead py-2">Precios desde</p>
                  <h1 className="py-3">$10</h1>
                  <a
                    href="#contact"
                    className={`btn btn-secondary btn-sm ${styles.btnsm}`}
                  >
                    Contratar
                  </a>
                </div>
              </div>
              <div
                className="col-md-6 col-lg-4 os-animation"
                data-animation="fadeInRight"
              >
                <div className={styles.pricingcolumn}>
                  <h3 className="border-bottom py-2 mx-3">Beisbol Adulto</h3>
                  <p className="lead py-2">
                    Todas las categorías del beisbol adulto.
                  </p>
                  <p className="lead py-2">Precios desde</p>
                  <h1 className="py-3">$20</h1>
                  <a
                    href="#contact"
                    className={`btn btn-secondary btn-sm ${styles.btnsm}`}
                  >
                    Contratar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="team" className="offset">
        <div className={styles.fixed}>
          <div className={`row ${styles.light}`}>
            <div className="col-12 os-animation" data-animation="fadeInUp">
              <h3 className={styles.heading}>Árbitros</h3>
              <div className={styles.headingunderline}></div>
            </div>
            <div className="container">
              <div className="os-animation" data-animation="fadeInUp">
                <div id="team-carousel" className="owl-carousel owl-theme">
                  <div className="card">
                    <img
                      src="/team2.jpg"
                      alt=""
                      className="card-img-top rounding-0"
                    />
                    <div className="card-body">
                      <h4 className="font-weight-bold">Miguel Barco</h4>
                      <h5 className={styles.textunion}>Presidente</h5>
                      <p className="border-top border-bottom py-3 my-3">
                        Miguel tiene más de 10 años de experiencia como arbitro.
                      </p>
                      <ul className={styles.social}>
                        <li>
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-instagram"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-linkedin"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card">
                    <img
                      src="/team1.jpg"
                      alt=""
                      className="card-img-top rounding-0"
                    />
                    <div className="card-body">
                      <h4 className="font-weight-bold">Abraham Rodriguez</h4>
                      <h5 className={styles.textunion}>Instructor</h5>
                      <p className="border-top border-bottom py-3 my-3">
                        Abraham tiene más de 10 años de experiencia como arbitro
                        e instructor.
                      </p>
                      <ul className={styles.social}>
                        <li>
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-instagram"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-linkedin"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card">
                    <img
                      src="/team3.jpg"
                      alt=""
                      className="card-img-top rounding-0"
                    />
                    <div className="card-body">
                      <h4 className="font-weight-bold">Yaison Palacios</h4>
                      <h5 className={styles.textunion}>Tesorero</h5>
                      <p className="border-top border-bottom py-3 my-3">
                        Yaison tiene más de 10 años de experiencia como arbitro.
                      </p>
                      <ul className={styles.social}>
                        <li>
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-instagram"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-linkedin"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card">
                    <img
                      src="/team4.jpg"
                      alt=""
                      className="card-img-top rounding-0"
                    />
                    <div className="card-body">
                      <h4 className="font-weight-bold">Jesus Lopez</h4>
                      <h5 className={styles.textunion}>Secretario</h5>
                      <p className="border-top border-bottom py-3 my-3">
                        Jesus tiene más de 10 años de experiencia como arbitro.
                      </p>
                      <ul className={styles.social}>
                        <li>
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-instagram"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-linkedin"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.fixedwrap}>
            <div className={styles.fixedlight}></div>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
};

export default Home;
