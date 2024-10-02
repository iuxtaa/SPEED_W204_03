import { useRouter } from 'next/router';
import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";

const PopulatedNavBar = () => {
    const router = useRouter();

    
    const onAdminPage = router.pathname.startsWith('/admin');

    return (
        <NavBar>
            <div className="speedTitle">SPEED</div> 
            <NavItem route="/homepage" end>Home</NavItem>
            <NavItem dropdown route="/articles">
                Articles <IoMdArrowDropdown />
                <NavDropdown>
                    <NavItem route="/articles">View Articles</NavItem>
                    <NavItem route="/Submission">Submit New</NavItem>
                </NavDropdown>
            </NavItem>
            {onAdminPage && (
                <NavItem dropdown>
                    User Management <IoMdArrowDropdown />
                    <NavDropdown>
                        <NavItem route="/admin/users">View Users</NavItem>
                        <NavItem route="/admin/permissions">Manage Permissions</NavItem>
                        <NavItem route="/admin/settings">Settings</NavItem>
                    </NavDropdown>
                </NavItem>
            )}
        </NavBar>
    );
};

export default PopulatedNavBar;
