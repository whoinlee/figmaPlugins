/*! For license information please see code.js.LICENSE.txt */
(()=>{"use strict";var e={7418:e=>{var t=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;function n(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var a={};return"abcdefghijklmnopqrst".split("").forEach((function(e){a[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},a)).join("")}catch(e){return!1}}()?Object.assign:function(e,i){for(var o,c,s=n(e),l=1;l<arguments.length;l++){for(var u in o=Object(arguments[l]))r.call(o,u)&&(s[u]=o[u]);if(t){c=t(o);for(var p=0;p<c.length;p++)a.call(o,c[p])&&(s[c[p]]=o[c[p]])}}return s}},2408:(e,t,r)=>{var a=r(7418);if("function"==typeof Symbol&&Symbol.for){var n=Symbol.for;n("react.element"),n("react.portal"),n("react.fragment"),n("react.strict_mode"),n("react.profiler"),n("react.provider"),n("react.context"),n("react.forward_ref"),n("react.suspense"),n("react.memo"),n("react.lazy")}"function"==typeof Symbol&&Symbol.iterator;function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var o={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},c={};function s(e,t,r){this.props=e,this.context=t,this.refs=c,this.updater=r||o}function l(){}function u(e,t,r){this.props=e,this.context=t,this.refs=c,this.updater=r||o}s.prototype.isReactComponent={},s.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(i(85));this.updater.enqueueSetState(this,e,t,"setState")},s.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},l.prototype=s.prototype;var p=u.prototype=new l;p.constructor=u,a(p,s.prototype),p.isPureReactComponent=!0;Object.prototype.hasOwnProperty},7294:(e,t,r)=>{r(2408)}},t={};function r(a){var n=t[a];if(void 0!==n)return n.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,r),i.exports}(()=>{r(7294);const e=e=>{let t=[];const r=e=>{e.children.forEach((e=>{"TEXT"===e.type&&t.push(e),"INSTANCE"===e.type&&r(e)}))};return e.forEach((e=>{r(e)})),t.flat(1/0)},t=(e,t)=>e.includes("metric")?t[1][e].map((e=>e.avg.toFixed(2))):t.map((t=>t[e])),a=["line-chart","spark-chart"],n=(e,t,r=null)=>{const a=figma.createVector();return t.forEach((t=>a[t]=e[t])),r&&(a.vectorPaths=r),a},i=e=>{let t=[];return e.forEach((e=>{if("TEXT"!==e.type){const r=e.findAllWithCriteria({types:["VECTOR"]});t.push(r)}})),t.flat(1/0)},o=e=>e.reduce(((e,t)=>Math.max(e,t))),c=e=>e.reduce(((e,t)=>Math.min(e,t))),s=(e,t,r=2)=>(Math.random()*(t-e)+e).toFixed(r),l=e=>{let t=[];for(let r=0;r<e;r++)t.push({x:(0===r?0:r+1)*(1/e),y:Math.random()});return t},u=(e,t,r=[])=>{const a=e.map((e=>e.x)),n=e.map((e=>e.y)),i=c(a),s=r.length>0?r[0]:c(n),l=o(a)-i,u=r.length>0?r[1]-r[0]:o(n)-s;return e.map(((e,r)=>({x:i+l*t[r].x,y:s+u*t[r].y})))},p=e=>e.reduce(((e,t,r)=>0===r?`M ${t.x} ${t.y}`:`${e} L ${t.x} ${t.y}`),""),f=e=>{const t=e.map((e=>e.x)),r=e.map((e=>e.y)),a=e[0].x,n=o(t),i=e[0].y,c=o(r);return p(e)+` L ${n} ${c}`+` L ${a} ${c}`+` L ${a} ${i} Z`},h=(e,t=null)=>{figma.skipInvisibleInstanceChildren=!0;const r=(e=>{let t=[];return function e(r){r.forEach((r=>{switch(r.type){case"GROUP":e(figma.ungroup(r));break;case"INSTANCE":case"FRAME":if(0==r.findAllWithCriteria({types:["GROUP"]}).length){t.push(r);break}const a="INSTANCE"===r.type?r.detachInstance():r;a.findAllWithCriteria({types:["GROUP"]}).forEach((e=>{figma.ungroup(e)})),t.push(a)}}))}(e),t})(e),o=(e=>{let t=[];return i(e).forEach((e=>{e.parent.name.split("/").forEach((e=>{a.includes(e)&&!t.includes(e)&&t.push(e)}))})),t})(r),c=r.filter((e=>e.name.split("/").includes("line-chart"))),h=r.filter((e=>e.name.split("/").includes("spark-chart")));let m=0;o.forEach((e=>{switch(e){case"line-chart":m++,((e,t=null)=>{t||(e=>{const t=i(e).filter((e=>e.parent.name.split("/").includes("line-chart")));let r=[],a=null;t.forEach((e=>{let t=e.parent;const i=e.vectorNetwork.vertices,o=l(i.length),c=u(i,o,[0,t.height]),s={windingRule:"NONE",data:p(c)},f=n(e,["name","strokes","strokeCap","strokeJoin","strokeWeight"],[s]);"INSTANCE"===t.type&&(t=t.detachInstance()),t.children[0].remove(),t.appendChild(f),t.parent?(a&&a!==t.parent&&(figma.group(r,a),r=[]),a=t.parent,r.push(t)):r.length>0&&(figma.group(r,a),r=[],a=null)})),a&&r.length>0&&(figma.group(r,a),"FRAME"===a.type&&a.parent&&figma.group([a],a.parent))})(e)})(c,t);break;case"spark-chart":m++,((e,t=null)=>{const r=e.filter((e=>0==e.children.filter((e=>e.name.split("/").includes("column-and-bar-chart"))).length));r.length>0&&((e,t=null)=>{e.forEach((e=>{let t="INSTANCE"===e.type?e.detachInstance():e;const r=t.children.filter((e=>e.name.includes("Vector"))),a=t.children.filter((e=>e.name.includes("Line")));let i=r[0],o=r[1];r[0].vectorPaths[0].data.endsWith("Z")&&(o=r[0],i=r[1]);const c=i.vectorNetwork.vertices,h=l(c.length),m=u(c,h,[0,t.height]),d={windingRule:"NONE",data:p(m)},g={windingRule:"NONE",data:f(m)},y=n(i,["name","strokes","strokeCap","strokeJoin","strokeWeight"],[d]),v=n(o,["name","opacity","fills"],[g]);i.remove(),o.remove(),t.appendChild(v),t.appendChild(y),figma.group([t],t.parent),a&&a.length>0&&a.forEach((e=>e.y=Math.floor(s(0,v.height))))}))})(r,t)})(h,t)}}));const d=0===m?"This visualization type is not currently supported!":"Successfully randomized "+e.length+" visualization(s)";figma.notify(d)};const m=figma.command.toString(),d=figma.fileKey.toString(),g=figma.currentPage.selection,y=figma.currentUser.name;switch(figma.showUI(__html__),m){case"bug":case"mock":figma.ui.resize(400,600),figma.ui.postMessage({command:m,fileKey:d,node:g[0],currentUser:y});break;case"changelog":figma.ui.resize(700,600),figma.ui.postMessage({command:m});break;case"data":figma.ui.resize(500,600),figma.ui.postMessage({command:m});break;case"visualize":figma.ui.resize(320,375),figma.ui.postMessage({command:m,selection:g});break;case"jira":figma.ui.resize(400,750),figma.ui.postMessage({command:m,fileKey:d,currentUser:y});break;default:figma.ui.resize(400,600),figma.ui.postMessage({command:"about"})}function v(){return e=this,t=void 0,a=function*(){return yield Promise.all([{family:"Roboto",style:"Regular"},{family:"Roboto",style:"Medium"},{family:"Roboto",style:"Light"}].map((e=>figma.loadFontAsync(e))))},new((r=void 0)||(r=Promise))((function(n,i){function o(e){try{s(a.next(e))}catch(e){i(e)}}function c(e){try{s(a.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,c)}s((a=a.apply(e,t||[])).next())}));var e,t,r,a}figma.ui.onmessage=r=>{const a=figma.currentPage.selection,{action:n,payload:i}=r;switch(n){case"randomize":(e=>{e&&e.length>0?h(e):figma.notify("No element selected!")})(a);break;case"applyDdata":(()=>{const r=t(i.key,i.services);if(a.length>0){const t=e(a);v().then((()=>{t.forEach(((e,t)=>{e.characters=r[t]}))}))}else figma.ui.postMessage("noneSelected")})();break;case"applyVariableData":(()=>{if(a.length>0){const r=e(a),n=(e=>[...new Set(e)])(r.map((e=>e.characters))),o=n.map((e=>e.replace("{","").replace("}",""))).map((e=>({key:e,data:t(e,i.services)})));v().then((()=>{r.forEach(((e,t)=>{if((r=e.characters).includes("{")&&r.includes("}")){const r=e.characters.replace("{","").replace("}","");e.characters=o.find((e=>e.key===r)).data[t]}var r}))}))}else figma.ui.postMessage("noneSelected")})()}}})()})();