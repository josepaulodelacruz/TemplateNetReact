
const NavbarTabs = ({
  children
}) => {

  return (
    <div className="pt-5">
      <div className="flex space-x-4 flex-row items-center justify-start border-b-1 mx-1">
        {children}
      </div>
    </div>
  );
};

export default NavbarTabs;
