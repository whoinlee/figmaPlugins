import {
    getAllTextNodes, 
    getKeysFromVariables, 
    getValuesFromKey,
    getUniqueValues, 
    isVariable 
} from './helpers/index';
import { randomizeVisualization } from './visualizations/index';


const COMMAND = figma.command.toString();
const FILEKEY = figma.fileKey.toString();
const SELECTION = figma.currentPage.selection; 
const CURRENT_USER = figma.currentUser.name;
const VIZ_TYPES = [
    "Randomize",
    "Apply data sets",
    "Apply time"
]

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

switch(COMMAND) {
    case "bug":
        figma.ui.resize(400, 600);
        figma.ui.postMessage({command: COMMAND, fileKey: FILEKEY, node: SELECTION[0], currentUser: CURRENT_USER});
        break;
    case "changelog":
        figma.ui.resize(700, 600);
        figma.ui.postMessage({command: COMMAND});
        break;
    case "mock":
        figma.ui.resize(400, 600);
        figma.ui.postMessage({command: COMMAND, fileKey: FILEKEY, node: SELECTION[0], currentUser: CURRENT_USER});
        break;
    case "data":
        figma.ui.resize(500, 600);
        figma.ui.postMessage({command: COMMAND});
        break;
    case "visualize":
        figma.ui.resize(320, 375);
        figma.ui.postMessage({ command: COMMAND, selection: SELECTION });
        break;
    case "jira":
        figma.ui.resize(400, 750);
        figma.ui.postMessage({command: COMMAND, fileKey: FILEKEY, currentUser: CURRENT_USER});
        break;
    default:
        figma.ui.resize(400, 600);
        figma.ui.postMessage({command: 'about'});
        break;
}

figma.ui.onmessage = (message) => {
    const selection = figma.currentPage.selection;
    const { action, payload } = message;

    const applyData = () => {
        const values = getValuesFromKey(payload.key, payload.services);
        if (selection.length > 0) {
            const textNodes = getAllTextNodes(selection);
            loadFonts()
                .then(() => {
                    textNodes.forEach((t,i) => {
                        t.characters = values[i]
                    })
                })
        }
        else {
            figma.ui.postMessage("noneSelected")
        }
    };

    const applyVariableData = () => {
        if (selection.length > 0) {
            const textNodes = getAllTextNodes(selection);
            const uniqueTextNodeVariables = getUniqueValues(textNodes.map(tn => tn.characters));
            const uniqueKeysFromVariables = getKeysFromVariables(uniqueTextNodeVariables);
            const values = uniqueKeysFromVariables.map(uk => { return { key: uk, data: getValuesFromKey(uk, payload.services)} })

            loadFonts()
                .then(() => {
                    textNodes.forEach((t,i) => {
                        if (isVariable(t.characters)) {
                            const key = t.characters.replace('{','').replace('}','');
                            t.characters = values.find(v => v.key === key).data[i]
                        }
                    })
                })
        }
        else {
            figma.ui.postMessage("noneSelected")
        }
    }

    switch (action) {
        case 'randomize':
            //-- can't use 'payload' as selection can be made again after figma ui is open
            randomizeVisualization(selection);
            break;
        case 'applyDdata':
            applyData();
            break;
        case 'applyVariableData':
            applyVariableData();
            break;
        default:
    }

    // if (action === "applyData") {
    //     const values = getValuesFromKey(payload.key, payload.services);
    //     if (selection.length > 0) {
    //         const textNodes = getAllTextNodes(selection);
    //         loadFonts()
    //             .then(() => {
    //                 textNodes.forEach((t,i) => {
    //                     t.characters = values[i]
    //                 })
    //             })
    //     }
    //     else {
    //       figma.ui.postMessage("noneSelected")
    //     }
    // }
    // if (action === "applyVariableData") {
    //     if (selection.length > 0) {
    //         const textNodes = getAllTextNodes(selection);
    //         const uniqueTextNodeVariables = getUniqueValues(textNodes.map(tn => tn.characters));
    //         const uniqueKeysFromVariables = getKeysFromVariables(uniqueTextNodeVariables);
    //         const values = uniqueKeysFromVariables.map(uk => { return { key: uk, data: getValuesFromKey(uk, payload.services)} })
    //         loadFonts()
    //             .then(() => {
    //                 textNodes.forEach((t,i) => {
    //                     if (isVariable(t.characters)) {
    //                         const key = t.characters.replace('{','').replace('}','');
    //                         t.characters = values.find(v => v.key === key).data[i]
    //                     }
    //                 })
    //             })
    //     }
    //     else {
    //       figma.ui.postMessage("noneSelected")
    //     }
    // }
}

async function loadFonts () {
    const fonts = [
        {
            family: "Roboto",
            style: "Regular"
        },
        {
            family: "Roboto",
            style: "Medium"
        },
        {
            family: "Roboto",
            style: "Light"
        },
    ];

    return await Promise.all(fonts.map(f => figma.loadFontAsync(f)))
}