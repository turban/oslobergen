/**
 * @author Shea Frederick
 */
Ext.define('TrackApp.view.map.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'map',

    requires: [
        'TrackApp.view.map.MapController',
        'Ext.button.Split'
    ],

    controller: 'map',

    listeners: {
        afterrenderer: 'onAfterRenderer',
        scope: 'controller'
    },

	title: 'oslobergen.no',
    header: false,
    tbar: [{
        reference: 'baseLayers',
        //xtype:'splitbutton',
        text: 'Map',
        iconCls: null,
        glyph: 61,
        menu: {
            listeners: {
                click: 'onBaseLayerClick'
            }            
        }
    },{
        xtype:'splitbutton',
        text: 'Show',
        iconCls: null,
        glyph: 61,
        menu:[{
            text: 'Elevation profile'
        },{
            text: 'Photos'
        }]
    },{
        xtype:'splitbutton',
        text: 'Route',
        iconCls: null,
        glyph: 61,
        menu:[{
            text: 'Day 1'
        },{
            text: 'Day 2'
        },{
            text: 'Day 3'
        }]
    },{
        xtype:'splitbutton',
        text: 'Social',
        iconCls: null,
        glyph: 61,
        menu:[{
            text: 'Facebook'
        },{
            text: 'Instagram'
        },{
            text: 'Twitter'
        }]
    }]
});