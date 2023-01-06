import React, { useState } from "react";
import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import fetchJson, { FetchError } from "../lib/fetchJson";

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = React.useState(false);

  return (
    <Layout>
      <LoginForm
        loading={loading}
        errorMessage={errorMsg}
        onSubmit={async function handleSubmit(event) {
          event.preventDefault();

          const body = {
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value,
          };

          setLoading(true);
          try {
            mutateUser(
              await fetchJson("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              })
            );
          } catch (error) {
            if (error instanceof FetchError) {
              setErrorMsg(error.data.message);
            } else {
              console.error("An unexpected error happened:", error);
            }
          }
          setLoading(false);
        }}
      />
    </Layout>
  );
}
