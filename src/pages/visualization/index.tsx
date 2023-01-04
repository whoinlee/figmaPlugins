import React from 'react';
import { useEffect } from 'react';
import { Button, Divider } from 'antd';
import logo from '../../images/logo_horizontal.svg';
import './style.css';

const VisualizationPage = ({ selection }) => {
  const randomize = (e = null) => {
    parent.postMessage(
      {
        pluginMessage: {
          action: 'randomize',
          payload: selection,
        },
      },
      '*'
    );
  };

  //--needs focus on uiWindow that we are removing this feature, keyboard shortcut for "randomize"
  // useEffect(() => {
  //   window.addEventListener(
  //     'keydown',
  //     (e) => {
  //       const isMac = navigator.userAgent.indexOf('Macintosh') >= 0;
  //       const isCmdCtrl = isMac && e.metaKey && e.ctrlKey;
  //       if (isCmdCtrl) {
  //         switch (e.key) {
  //           case 'r':
  //           case 'R':
  //             randomize();
  //             break;
  //           default:
  //             return;
  //         }
  //       }
  //     },
  //     false
  //   );
  // }, []);

  return (
    <>
      <img src={logo} className="logo" />
      <h2> Visualizations</h2>
      Please make a selection(s) in the canvas, then select a visualization you
      would like to apply.
      <Divider />
      <div className="viz-menuHolder">
        <div className="viz-buttonHolder">
          <Button type="primary" onClick={randomize}>
            Randomize
          </Button>
        </div>
        <div className="viz-buttonHolder">
          <Button type="primary" disabled={true}>
            Apply data sets
          </Button>
        </div>
        <div className="viz-buttonHolder">
          <Button type="primary" disabled={true}>
            Apply time
          </Button>
        </div>
      </div>
    </>
  );
};

export default VisualizationPage;
