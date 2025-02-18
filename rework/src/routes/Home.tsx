import { Header, Navbar } from "../components";
import "../styles/Home.css";

export const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="home-main">
        <div className="home-content-container">
          <div className="home-logo-container">
            <img src="/salinstudio-logo.svg" alt="" className="home-logo" />
          </div>
          <div className="home-hero-container">
            <Navbar />
            <div className="home-hero">
              <div className="home-hero-text-container">
                <h1 className="home-hero-heading">Welcome to my studio</h1>
                <p className="home-hero-p">
                  I create art with a focus on portraits, still-life, surrealism
                  and symbolism, with a splash of cartoons and horror mixed in.
                </p>
                <p className="home-hero-p">
                  Follow me on Instagram or feel free to contact me on here.
                </p>
              </div>
              <a href="/gallery" className="home-hero-link">
                my art
              </a>
              <div className="home-hero-contact-container">
                <a href="" className="home-hero-contact-link">
                  Contact
                </a>
                <a href="" className="home-hero-contact-link">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="top-reel"></div>
        <div className="bot-reel"></div>
      </main>
    </div>
  );
};
