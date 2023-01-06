import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { sessionOptions } from "../lib/session";
import styles from "../styles/Home.module.css";
import { User } from "./api/user";
import Layout from "../components/Layout";

const Home = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Sistema de coordinación y finanzas de Liga de Árbitros Unión!</h2>
        </header>

        <main className={styles.main}></main>
      </div>
    </Layout>
  );
};

export default Home;

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
