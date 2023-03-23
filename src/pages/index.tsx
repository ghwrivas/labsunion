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

        <div className={`${styles.caption} text-center text-light text-uppercase`}>
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
            href="#features"
            className="btn btn-outline-light btn-lg rounded-0 os-animation"
            data-animation="bounceInUp"
            data-delay="1s"
          >
            SERVICIOS
          </a>
        </div>
      </div>
    </LayoutHome>
  );
};

export default Home;
