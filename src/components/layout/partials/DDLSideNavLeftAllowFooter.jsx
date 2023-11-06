const DDLSideNavLeftAllowFooter = ({children}) => {

  return(
    <div id="layoutSidenav_nav">
      <nav class="sb-sidenav accordion sb-sidenav-dark ddl-explorer-sidebars" id="sidenavAccordion" >
        {children}
      </nav>
    </div>
  );
}

export default DDLSideNavLeftAllowFooter;