import {Suspense } from "react";

import { jsPanel } from 'jspanel4/es6module/jspanel';
import 'jspanel4/es6module/extensions/modal/jspanel.modal';

import { store } from "../redux";
import CreatePortal from '../components/createPortal';
import { DashboardActions } from "../redux/actions";

//default panel options
var jsPanelOptions =  {
  /* css options not working ?
  css:{
    content: 'classA classB',   // adds the classes to ".jsPanel-content"
    ftr: 'classC',              // adds the classes to ".jsPanel-ftr"
    panel: 'classD'            // adds the classes to ".jsPanel"
  },
  */
  iconfont: ['custom-smallify', 'custom-minimize', 'custom-normalize', 'custom-maximize', 'custom-close'],
  border: "2px solid #019c9d",
  // OEM headerLogo: "/icon.png" ,
  headerLogo: "/explorer/icon.png" ,
  position: 'center 50 50',
  headerTitle: () => {
    let count = document.querySelectorAll('.jsPanel').length;
    return `Panel No: <mark class="px-1 rounded-full text-base">${count}</mark>`;
  },
  //position: 'center 100 100' ,
  dragit: {
    opacity: 1
  },
  headerControls: {
    smallify: 'remove'
  },
  panelSize: '40% 50%',
  theme: 'primary',
  headerTitle: 'Default Title',
  position: 'center-top 0 20%',
  contentSize: {
    width: `${Math.round(window.innerWidth / 1.2)}px`,
    height: `auto`
  },
  contentOverflow: 'auto',
  onwindowresize: false,
  content: panel => {
    const div = document.createElement('div');
    const newId = `${panel.id}-node`;
    div.id = newId;
    panel.content.append(div);
  },
  callback: panel => { 
    panel.content.style.padding = '10px';
    const maxHeight = window.innerHeight - (window.innerHeight * 30) / 100;
    panel.content.style.maxHeight = `${maxHeight}px`;
    panel.content.style.maxWidth = `${window.innerWidth - 20}px`;
  },
  onclosed: () => {}

}
export default jsPanelOptions ;

export function createJsPanel (action, comp, modal = false , attr = null ) { // , updatePanels is no longer required

  let state = store.getState();

  let title = typeof action === 'object' ? action.title : action ;

  if(typeof action === 'object'){
    action = action.ref ? action.ref :  new Date().getTime();
  }


  if (state.dashboard.panels[action]) {
    return state.dashboard.panels[action]['panel'].front(() => {
      state.dashboard.panels[action]['panel'].resize({
        height: 'auto'
      });
      state.dashboard.panels[action]['panel'].reposition('center-top 0 20%');
    });
  }

  let optionsOverwrite = attr.optionsOverwrite ? attr.optionsOverwrite : {} ;
  

  const options = {
    ...jsPanelOptions,
    ...optionsOverwrite,
    //panelSize: attr.optionsOverwrite.panelSize ? attr.optionsOverwrite.panelSize : jsPanelOptions.panelSize ,
    headerTitle: title,
    onclosed: () => { 
      // remove closed jsPanel and its mounted component from state
      const appPanels = store.getState().dashboard.panels; 
      if (appPanels[action]) {
        delete appPanels[action];
        // OEM updatePanels(appPanels);
        store.dispatch(DashboardActions.updatePanels(appPanels));
      }
    }
  }
  // console.log('modal  >>>>>>>>', modal );
  // create jsPanel
  const panel = modal ? jsPanel.modal.create(options) : jsPanel.create(options);
  // save panel and compponent (this will be mounted later inside panel body) reference inside state
  /* OEM 
  updatePanels({
    ...state.dashboard.panels,
    [action] : {panel,comp,attr}
  });
  */
  store.dispatch(DashboardActions.updatePanels({
    ...state.dashboard.panels,
    [action] : {panel,comp,attr}
  }));

}


export function renderJsPanlesInsidePortal(panels) {
  // const panels = this.props.panels;

  return Object.keys(panels).map(action => {

    const jsPanel = panels[action].panel;
    const Comp = panels[action].comp;
    const attr = panels[action].attr;
    const node = document.getElementById(`${jsPanel.id}-node`);
    let counter = 0;
    if (!Comp) return null;
    return (
      <CreatePortal rootNode={node} key={jsPanel.id}>
        { Array.isArray(Comp) ?

          (
            Comp.map(C =>(
              <Suspense key={`${jsPanel.id}-${counter++}`} fallback={<div className="alert alert-info">Loading...</div>}>
                <C jsPanel={jsPanel} {...attr} />
              </Suspense>
            ))
          )

          :

          (
            <Suspense fallback={<div className="alert alert-info">Loading...</div>}>
              <Comp jsPanel={jsPanel} {...attr} />
            </Suspense>
          )

        }
      </CreatePortal>
    );

  });

}