/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('TrackApp.view.main.Main', {
    extend: 'Ext.container.Container',

    xtype: 'app-main',
    
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'map',
        region: 'center'
    },{
        title: 'Høydekurve',
        region: 'south',
        header: false,
        collapsible: true,
        split: true,
        height: 100,
        minHeight: 75,
        html: 'Høydekurve'
    }]
});
