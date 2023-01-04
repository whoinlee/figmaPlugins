import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './main.css';
import 'antd/dist/antd.css';

import AboutPage from './pages/about/index';
import BugPage from './pages/bug/index';
import MockPage from './pages/mock/index';
import ChangelogPage from './pages/changelog/index';
import DataPage from './pages/data/index';
import VisualizePage from './pages/visualization/index';
import JiraPage from './pages/jira/index';

declare function require(path: string): any;

onmessage = (e) => {
  const { command, fileKey, node, selection, currentUser } =
    e.data.pluginMessage;
  let renderPage: any;

  switch (command) {
    case 'bug':
      renderPage = (
        <BugPage fileKey={fileKey} node={node} currentUser={currentUser} />
      );
      break;
    case 'mock':
      renderPage = (
        <MockPage fileKey={fileKey} node={node} currentUser={currentUser} />
      );
      break;
    case 'changelog':
      renderPage = <ChangelogPage />;
      break;
    case 'data':
      renderPage = <DataPage />;
      break;
    case 'visualize':
    case 'randomize':
    case 'applydata':
    case 'applytime':
      renderPage = <VisualizePage selection={selection} />;
      break;
    case 'jira':
      renderPage = <JiraPage fileKey={fileKey} currentUser={currentUser} />;
      break;
    default:
      renderPage = <AboutPage />;
  }

  ReactDOM.render(renderPage, document.getElementById('react-page'));
};
