import React from 'react';
import { apiBaseUrl }  from "../utilities/Helpers" ;


const DelphiEnv = {

  popup : (type , msgLines ) => {
    
    window.ddl.popup( msgLines.join("\n"), type );
  },


  isParentEnv : () => {

    return window.ddl != null  ;

  },

  authPopup : () => {

  	window.ddl.browserPopup(
  		`${apiBaseUrl()}/ddr/do_auth`, 
  		{
  			title: 'GoFish Authorization',
        widthPercent: 60,
        heightPercent: 80,
  			returnValueIfWindowsCloseXClicked: 'windows close x clicked from popup do send report afma',
  			buttons: [ // even though this is an array, only zero or one entries are handled correctly.
          { caption: 'Close', returnValue: 'windows close event triggered from popup do send report afma'},
        ]
  		},
  		'handlePopupResult' // this must be a string with name of a callback function - must not be a function itself.
  	)
  },
  authPopupRefresh : () => {

    window.ddl.browserPopup(
      `${apiBaseUrl()}/ddr/do_auth_refresh`, 
      {
        title: 'GoFish Authorization',
        widthPercent: 60,
        heightPercent: 80,
        returnValueIfWindowsCloseXClicked: 'windows close x clicked from popup do send report afma',
        buttons: [ // even though this is an array, only zero or one entries are handled correctly.
          { caption: 'Close', returnValue: 'windows close event triggered from popup do send report afma'},
        ]
      },
      'handlePopupResult' // this must be a string with name of a callback function - must not be a function itself.
    )
  },
  authPopupRevoke : () => {

    window.ddl.browserPopup(
      `${apiBaseUrl()}/ddr/do_auth_revoke`, 
      {
        title: 'GoFish Authorization',
        widthPercent: 60,
        heightPercent: 80,
        returnValueIfWindowsCloseXClicked: 'windows close x clicked from popup do send report afma',
        buttons: [ // even though this is an array, only zero or one entries are handled correctly.
          { caption: 'Close', returnValue: 'windows close event triggered from popup do send report afma'},
        ]
      },
      'handlePopupResult' // this must be a string with name of a callback function - must not be a function itself.
    )
  },
  doSendReportPopup: () => {
    window.ddl.browserPopup(
      `${apiBaseUrl()}/ddr/do_send_reports`,
      {
        title: 'AFMA Report Sender',
        widthPercent: 60,
        heightPercent: 80,
        returnValueIfWindowsCloseXClicked: 'windows close x clicked from popup do send report afma',
        buttons: [ // even though this is an array, only zero or one entries are handled correctly.
          { caption: 'Close', returnValue: 'windows close event triggered from popup do send report afma'},
        ]
      },
      'handlePopupResult' // this must be a string with name of a callback function - must not be a function itself.
    );
  },
  viewReportPopup : (id) => {
    window.ddl.browserPopup(
      `${apiBaseUrl()}/ddr/do_view_report?id=`+ id ,
      {
        title: 'Report Viewer',
        widthPercent: 60,
        heightPercent: 80,
        returnValueIfWindowsCloseXClicked: 'windows close x clicked from popup do view report afma',
        buttons: [ // even though this is an array, only zero or one entries are handled correctly.
          { caption: 'Close', returnValue: 'windows close event triggered from popup do view report afma'},
        ]
      },
      'handlePopupResult' // this must be a string with name of a callback function - must not be a function itself.
    );
  },
  closeAuthPopup : () => {
  	window.ddl.closeBrowser('Authentication completed');
  },
  closeConfirmSaveConfigPopup : (msg) => {
    window.ddl.closeBrowser(msg);
  },
  confirmConfigurationPopup : () => {
    window.ddl.browserPopup(
      `${apiBaseUrl()}/ddr/do_confirm_configuration` ,
      {
        title: 'Confirm Configuration',
        widthPercent: 45,
        heightPercent: 40,
        returnValueIfWindowsCloseXClicked: 'windows close x clicked from popup do confirm configuration afma',
        buttons: [ // even though this is an array, only zero or one entries are handled correctly.
          { caption: 'Close', returnValue: 'windows close event triggered from popup do confirm configuration afma'},
        ]
      },
      'handlePopupResult' // this must be a string with name of a callback function - must not be a function itself.
    );
  },

  filePickerDialog : (dueTo) => {
    window.ddl.ipcOpenFileDialog('onIpcOpenFileDialog' , dueTo );
  }

}

export default DelphiEnv ;
