import './Root.css';
import Header from '../Header/Header';

export const Root = ({ children }) => {
  return (
    <div className="Root-container">
      {/* Ajout des étoiles et étoiles filantes */}
      <div className="stars"></div>
      <div className="stars"></div>
      <div className="shooting-stars-container">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>
      <Header />
      <div className="Root-content">{children}</div>
    </div>
  );
};
