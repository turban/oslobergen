Ext.define('TrackApp.view.map.Map', {
    extend: 'Ext.panel.Panel',
    requires: [
        'TrackApp.view.map.MapController'
    ],    
    xtype: 'map',
    controller: 'map',
    cls: 'map'
});