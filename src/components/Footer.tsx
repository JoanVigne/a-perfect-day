import Link from "next/link";
import React, { useState } from "react";
import "./footer.css";
import { usePathname } from "next/navigation";
import { NavLink } from "react-router-dom";

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
      {/*    <NavLink
        to="/messages"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Messages
      </NavLink>
       */}
      <nav>
        <ul>
          <li className={pathname == "/" ? "active-link" : ""}>
            <Link href="/">Routine</Link>
          </li>
          <li className={pathname == "/improve" ? "active-link" : ""}>
            <Link href="/improve">Improve</Link>
          </li>
          <li className={pathname == "/workout" ? "active-link" : ""}>
            <Link href="/workout">Workout</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
