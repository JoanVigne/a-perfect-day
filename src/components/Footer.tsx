import Link from "next/link";
import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link href="/">Routine</Link>
          </li>
          <li>
            <Link href="/improve">Improve</Link>
          </li>

          <li>
            <Link href="/historic">historic</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
