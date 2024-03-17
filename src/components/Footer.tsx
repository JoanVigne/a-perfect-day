import Link from "next/link";
import React, { useState } from "react";
import "./footer.css";

const Footer = () => {
  // a refaire avec plus de next
  const [activeLink, setActiveLink] = useState<string>("");

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <footer>
      <nav>
        <ul>
          <li
            className={
              activeLink === "/" || currentPath === "/" ? "active" : ""
            }
            onClick={() => handleLinkClick("/")}
          >
            <Link href="/">Routine</Link>
          </li>
          <li
            className={
              activeLink === "/improve" || currentPath === "/improve"
                ? "active"
                : ""
            }
            onClick={() => handleLinkClick("/improve")}
          >
            <Link href="/improve">Improve</Link>
          </li>
          <li
            className={
              activeLink === "/historic" || currentPath === "/historic"
                ? "active"
                : ""
            }
            onClick={() => handleLinkClick("/historic")}
          >
            <Link href="/historic">Historic</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
