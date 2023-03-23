import Header from "./Header";

export default function LayoutHome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
}
