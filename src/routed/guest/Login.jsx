import { useState , useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link, Redirect , useLocation } from "react-router-dom";


import Layout from "../../components/layout/Layout";
import DDLMenuBar from "../../components/layout/partials/DDLMenuBar";
import DDLMenuItems from "../../components/layout/partials/DDLMenuItems";
import DDLBodyContainer from "../../components/layout/partials/DDLBodyContainer";

import LoginForm from "../../components/pages/login/LoginForm";
import GuestMenu from "../../components/pages/GuestMenu";

const Login = () => {

	/*OEM
	const location = useLocation();
	const logoutParam = new URLSearchParams(location.search).get('logout');
	const isLogoutSuccess = logoutParam == 'success' ? true : false ;
	const [showLogoutSuccessNotification , setShowLogoutSuccessNotification ] = useState(isLogoutSuccess);
	*/


	const [tabKey, setTabKey] = useState('tab-one');

	const token = useSelector((state) => state.auth.user.token);

	return(
		<Layout>
			{token ? <Redirect to="/explorer/maps" /> : null}

			<DDLMenuBar>
				<DDLMenuItems>
					<GuestMenu />
				</DDLMenuItems>
			</DDLMenuBar>

			<DDLBodyContainer customClasses="d-flex align-items-center justify-content-center h-100"> {/* add classes to center login form*/}
				
					<div 
						className="d-flex align-items-center justify-content-center w-100"
						style={{marginTop:"-7rem"}}
					>
						<LoginForm/>
					</div>
				
			</DDLBodyContainer>


			
		</Layout>
	);
}

export default Login;