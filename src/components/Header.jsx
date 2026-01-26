export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>🍲 African Recipe AI</h1>
      <p style={styles.subtitle}>
        Générateur intelligent de recettes africaines
      </p>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e5e5",
    padding: "16px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#666",
  },
};
