import Link from "next/link";
import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link href="/">home</Link>
          </li>
          <li>
            <Link href="/aperfectday">a perfect day</Link>
          </li>
          <li>
            <Link href="/tasks">tasks </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
