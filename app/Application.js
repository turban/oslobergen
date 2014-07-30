/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('TrackApp.Application', {
    extend: 'Ext.app.Application',
    
    name: 'TrackApp',

    requires: [
        'TrackApp.config.Runtime'
    ],

    views: [
        'map.Map',
        'profile.Profile',
        //'instagram.Instagram',
        'positions.Positions'
    ],

    controllers: [
        'Root'
    ],

    stores: [
        'Track',
        'Instagram'
    ],
    
    launch: function () {
        // TODO - Launch the application
    }
});
