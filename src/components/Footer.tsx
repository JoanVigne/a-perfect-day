import Link from "next/link";
import React, { useState } from "react";
import "./footer.css";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
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
          <li>
            <Link href="/" className={pathname == "/" ? "active-link" : ""}>
              Routine
            </Link>
          </li>
          <li>
            <Link
              href="/improve"
              className={pathname == "/improve" ? "active-link" : ""}
            >
              Improve
            </Link>
          </li>
          <li>
            <Link
              href="/workout"
              className={pathname == "/workout" ? "active-link" : ""}
            >
              Workout
            </Link>
          </li>
          {/*  <li>
            <Link
              href="/historic"
              className={pathname == "/historic" ? "active-link" : ""}
            >
              Historic
            </Link>
          </li> */}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
