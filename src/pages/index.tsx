import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { createTodo, deleteTodo, toggleTodo, useTodos } from "../api";
import { sessionOptions } from "../lib/session";
import styles from "../styles/Home.module.css";
import { Todo } from "../types";
import { User } from "./api/user";
import Layout from "../components/Layout";

export const TodoList: React.FC = () => {
  const { data: todos, error } = useTodos();

  if (error != null) return <div>Error loading todos...</div>;
  if (todos == null) return <div>Loading...</div>;

  if (todos.length === 0) {
    return <div className={styles.emptyState}>Try adding a todo ☝️️</div>;
  }

  return (
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem todo={todo} />
      ))}
    </ul>
  );
};

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li className={styles.todo}>
    <label
      className={`${styles.label} ${todo.completed ? styles.checked : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        className={`${styles.checkbox}`}
        onChange={() => toggleTodo(todo)}
      />
      {todo.text}
    </label>

    <button className={styles.deleteButton} onClick={() => deleteTodo(todo.id)}>
      ✕
    </button>
  </li>
);

const AddTodoInput = () => {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        createTodo(text);
        setText("");
      }}
      className={styles.addTodo}
    >
      <input
        className={styles.input}
        placeholder="Buy some milk"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.addButton}>Add</button>
    </form>
  );
};

const Home = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Welcome to the home page {user.nombre}!</h2>
          <h1 className={styles.title}>Todos</h1>
          <h2 className={styles.desc}>
            NextJS app connected to Postgres using Prisma and hosted on{" "}
            <a href="https://railway.app">Railway</a>
          </h2>
        </header>

        <main className={styles.main}>
          <AddTodoInput />

          <TodoList />
        </main>
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
