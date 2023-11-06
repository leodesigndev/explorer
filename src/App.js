import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, withRouter , BrowserRouter } from "react-router-dom";
import Loader from "./components/loader";

import { compose } from "redux";
import { connect } from "react-redux";
import { isAuthenticated } from "./redux/selector/auth.Selector";

import DelphiEnv from './components/DelphiEnv';

const Homepage = lazy(() => import("./routed/guest/HomePage"));
const Login = lazy(() => import("./routed/guest/Login"));


const dataMatrices = lazy(() => import("./routed/data_matrices"));
const CreateMatrix = lazy(() => import("./routed/data_matrices/Create"));

const SavedMaps = lazy(() => import("./routed/maps"));
const CreateMapWizard = lazy(() => import("./routed/maps/CreateMapWizard"));
const OpenMap = lazy(() => import("./routed/maps/OpenMap"));
const MapDataTable = lazy(() => import("./routed/maps/MapDataTable"));

const CreateMapStep1 = lazy(() => import("./routed/maps/CreateMapStep1"));
const CreateMapStep2 = lazy(() => import("./routed/maps/CreateMapStep2"));


/*
const Homepage = lazy(() => import("./routed/home/HomePage"));
const Explorerpage = lazy(() => import("./routed/explorer"));

const RenderMaps = lazy(() => import("./routed/maps/Render"));



*/


const About = lazy(() => import("./routed/about"));

const Loading = () => <Loader color="primary" />;

function App() {

  let routes = (
    <Switch>

      <Route exact path="/" component={Homepage}></Route>
      <Route exact path="/explorer/login" component={Login}></Route>


      <Route exact path="/explorer/maps/create_step/:step_number" component={CreateMapWizard}></Route> 
      <Route exact path="/explorer/maps/open/:map_id" component={OpenMap}></Route> {/* Map datatable ? @TODO protect route inforce user ACL */}
      <Route exact path="/explorer/maps/data_table" component={MapDataTable}></Route>
      {/*  <Route exact path="/maps/create_step/:step_number" component={CreateMapWizard}></Route> */}


      {/* <Route exact path="/explorer/maps/create/:step" component={CreateMapWizard}></Route> */}
      <Route exact path="/explorer/maps/create/step1" component={CreateMapStep1}></Route>
      <Route exact path="/explorer/maps/create/step2" component={CreateMapStep2}></Route>
      

      <Route exact path="/explorer" component={SavedMaps}></Route> {/* @TODO review ? */}
      <Route exact path="/explorer/maps" component={SavedMaps}></Route>
      <Route exact path="/explorer/data_matrices" component={dataMatrices}></Route>
      <Route exact path="/explorer/data_matrices/create" component={CreateMatrix}></Route>

      {/* OEM
      <Route exact path="/explorer/maps/render" component={RenderMaps}></Route>
      
       */}

      <Redirect to="/" />
      
    </Switch>
  );

  return (
    <div>
      <Suspense fallback={Loading}>{routes}</Suspense>
    </div>
  );

}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state)
  };
};

export default compose(withRouter, connect(mapStateToProps))(App);
