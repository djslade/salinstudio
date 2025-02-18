import "../styles/Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <a className="navbar-link" href="/">
        Home
      </a>
      <a className="navbar-link" href="/about">
        About
      </a>
      <a className="navbar-link" href="/gallery">
        Gallery
      </a>
      <a className="navbar-link" href="/blog">
        Blog
      </a>
      <a className="navbar-link" href="/store">
        Buy
      </a>
    </nav>
  );
};
