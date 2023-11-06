const DDLSideNavRight = ({children}) => {

  return(
    <div id="layoutSidenav_nav-right" >
      <nav className="sb-sidenav-right accordion sb-sidenav-dark" id="sidenavAccordion-right" >
        {children}
      </nav>
    </div>
  );
}

export default DDLSideNavRight;