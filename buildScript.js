const fs = require('fs');
const fse = require('fs-extra');
const childProcess = require('child_process');

if (fs.existsSync('./build')) {
	fse.removeSync('./build');
}

// run 'react-scripts build'
childProcess.execSync('react-scripts build', { stdio: 'inherit' });

// fresh all // @TODO make param for this
fse.removeSync('./ui');

// move build to public
fse.moveSync('./build', './ui', { overwrite: true });
