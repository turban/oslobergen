/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('TrackApp.Application', {
    extend: 'Ext.app.Application',
    
    name: 'TrackApp',

    views: [
        'map.Map'
    ],

    controllers: [
        'Root'
    ],

    stores: [
        // TODO: add stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
    }
});
