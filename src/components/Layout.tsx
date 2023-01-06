import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="d-flex flex-column min-vh-100">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
