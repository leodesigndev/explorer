const DDLSideNavLeft = ({children}) => {

  return(
    <div id="layoutSidenav_nav">
      <nav class="sb-sidenav accordion sb-sidenav-dark ddl-explorer-sidebars" id="sidenavAccordion" >
        <div class="sb-sidenav-menu" >
          {children}
        </div>
      </nav>
    </div>
  );
}

export default DDLSideNavLeft;