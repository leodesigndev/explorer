const DDLBodyContainer = ({children , customClasses }) => {

  return(
    <div id="layoutSidenav" className={customClasses} >
        {children}
    </div>
  );
}

export default DDLBodyContainer;