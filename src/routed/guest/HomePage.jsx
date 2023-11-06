import { useState , useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";


import Layout from "../../components/layout/Layout";
import DDLMenuBar from "../../components/layout/partials/DDLMenuBar";
import DDLMenuItems from "../../components/layout/partials/DDLMenuItems";
import DDLBodyContainer from "../../components/layout/partials/DDLBodyContainer";

import HomePageContent from "../../components/pages/home/HomePageContent";
import GuestMenu from "../../components/pages/GuestMenu";

const HomePage = () => {

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

			<DDLBodyContainer>
				<HomePageContent/>
			</DDLBodyContainer>


			
		</Layout>
	);
}

export default HomePage;