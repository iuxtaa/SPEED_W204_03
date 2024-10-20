import { useRouter } from 'next/router';
import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";

const PopulatedNavBar = () => {
  const router = useRouter();

  const onAdminPage = router.pathname.startsWith('/admin');

  const navigateToHome = () => {
    router.push('/');
  };

  return (
    <NavBar>
      <div className="speedTitle" onClick={navigateToHome} style={{ cursor: 'pointer' }}>
        SPEED
      </div>
      <NavItem route="/" end>
        Home
      </NavItem>
      <NavItem dropdown route="/SearchArticles">
        Articles <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem route="/SearchArticles">View Articles</NavItem>
          <NavItem route="/submission">Submit New</NavItem>
          <NavItem route="/Bibtex">Submit Article as Bibtex</NavItem>
          <NavItem route="/Moderator">Moderator Dashboard</NavItem>
          <NavItem route="/rejectedarticles">Rejected Articles Dashboard</NavItem>
          <NavItem route="/AnalystDashboard">Analyst Dashboard</NavItem>
          <NavItem route="/admin">Admin Edit Article</NavItem>
          <NavItem route="/users">Admin Edit Users</NavItem>
        </NavDropdown>
      </NavItem>
      {onAdminPage && (
        <NavItem dropdown>
          User Management <IoMdArrowDropdown />
          <NavDropdown>
            <NavItem route="/users">View Users</NavItem>
          </NavDropdown>
        </NavItem>
      )}
      <div className="nav-right">
        <NavItem route="/Login" end>
          Login
        </NavItem>
      </div>
    </NavBar>
  );
};

export default PopulatedNavBar;
