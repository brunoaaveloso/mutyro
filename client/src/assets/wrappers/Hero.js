import styled from "styled-components";

const Wrapper = styled.div`
  .hero {
    position: relative;
    height: 80vh;
    color: white;
    overflow: hidden;
    background-image: url("https://res.cloudinary.com/dunfagpl8/image/upload/v1751953979/community_q0k4y8.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 5rem;
    max-width: var(--max-width);
    margin-bottom: 0;
    margin-top: calc(var(--nav-height) * -1.5);
  }

  .hero-content {
    align-items: center;
    gap: 1.5rem;
  }

  .hero-cta {
    position: relative;
    display: flex;
    max-width: var(--max-width);
    flex-direction: row;
    gap: 1rem;
  }

  .hero-text {
    display: flex;
    flex-direction: column; /* Stack items */
    align-items: flex-start; /* Align text & buttons to the left */
  }

  p::before,
  p::after {
    color: var(--dark-color);
  }

  p::before {
    content: "❝ ";
  }
  p::after {
    content: "❞";
  }

  p {
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.4),
      -2px -2px 4px rgba(255, 255, 255, 0.3);
    letter-spacing: 2px;
    font-style: italic;
    text-shadow: rgba(0, 153, 255, 2);
    font-family: Montserrat;
    font-weight: 500;
    color: var(--dark-color);
    padding-right: 3rem;
    font-style: italic;
    position: absolute;
    z-index: 1;
    right: 0;
    max-width: 20rem;
    max-height: 10rem;
  }

  .hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: rgba(
      255,
      210,
      149,
      0.6
    ); /* Adjust opacity here (0 = transparent, 1 = solid) */
  }

  .hero h1 {
    line-height: 3rem;
    font-size: 8.5rem;
    color: orange;
    text-shadow: 7px 1px rgba(0, 153, 255, 1);
    z-index: 1;
    font-family: "Bebas Neue";
  }
  .hero h2 {
    line-height: 4rem;
    font-size: 2.5rem;
    color: white;
    text-shadow: 3px 1px rgba(0, 153, 255);
    z-index: 1;
    font-family: "Bebas Neue";
  }
  .hero .wave {
    position: absolute; /* Position the SVG at the bottom */
    bottom: 0; /* Align to the bottom of the parent */
    left: 0;
    width: 100%;
    max-width: var(--max-width);
    height: auto;
    max-height: 25vh;
    margin-bottom: -2px;
  }

  .btn {
    font-weight: 600;
    font-size: 14px;
    color: white;
    width: 6rem;
    padding: 0.8rem;
    text-align: center;
    margin: 0 auto;
  }

  .login-link {
    color: var(--dark-color);
    background-color: var(--light-color);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transform: translateY(0);
    background: rgba(0, 0, 0, 0.5); /* Dark overlay */
    backdrop-filter: blur(5px); /* Blur effect */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    box-shadow: var(--shadow-2);
    position: relative;
    text-align: center;
    transform: translateY(0);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .ctn-btns {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  @media (max-width: 992px) {
    .hero-quotation {
      position: relative;
      right: auto;
      left: auto;
      width: 90%;
      max-width: 35rem;
      text-align: center;
      margin: 1rem auto;
      padding-right: 0;
    }
  }

  @media (max-width: 768px) {
    p {
      white-space: normal;
      word-wrap: break-word;
      min-width: 20rem;
      max-width: var(--max-width);
      font-size: 0.9rem;
      font-weight: 600;
      text-align: center;
      padding: 0 auto;
      margin: 1rem auto;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .hero-cta {
      align-self: center;
      width: 70vw;
      align-items: center;
      flex-direction: column;
      gap: 0rem;
    }

    .hero {
      overflow-y: hidden;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      padding: var(--nav-height) auto;
    }

    .hero h1 {
      line-height: 3rem;
      font-size: 7rem;
    }
    .hero h2 {
      line-height: 2rem;
      font-size: 2rem;
    }
  }
`;

export default Wrapper;
