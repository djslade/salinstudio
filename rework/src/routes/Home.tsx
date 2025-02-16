import { Header } from "../components";
import "../styles/Home.css";

export const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="home-main">
        <div className="home-hero">
          <p>
            Welcome to my art studio! Here you can find artworks focusing on
            portraits, still life, surrealism, symbolism mixed with some cartoon
            and horror art. You can find rest of my works on instagram.
          </p>
          <p>
            If you want to know more or ask me questions, please feel free to
            contact me.
          </p>
          <a href="/gallery">Artworks</a>
        </div>
      </main>
      <div className="top-reel"></div>
      <div className="bot-reel"></div>
    </div>
  );
};
