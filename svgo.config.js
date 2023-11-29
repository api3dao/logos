module.exports = {
    multipass: false,
    js2svg: {
        indent: 4,
        pretty: true
    },
    plugins: [
        "removeDoctype",
        "removeXMLProcInst",
        "removeComments",
        "removeMetadata",
        "removeEditorsNSData",
        "inlineStyles",
        "removeUnusedNS",
        'sortAttrs',
        'removeScriptElement',
        'removeDimensions'
    ]













};
