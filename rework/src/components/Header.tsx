import { IoIosMenu } from "react-icons/io";
import "../styles/Header.css";

export const Header = () => {
  return (
    <header className="header">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className="header-logo"
      />
      <button className="header-mobile-menu-btn">
        <IoIosMenu className="mobile-btn-icon" />
      </button>
    </header>
  );
};
