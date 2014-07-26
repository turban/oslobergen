Ext.define('TrackApp.view.positions.Positions', {
    extend: 'Ext.grid.Panel',
    xtype: 'positions',

    requires: [
        'TrackApp.view.positions.PositionsController',
        'Ext.grid.column.Number'
    ],

    controller: 'positions',

    store: 'Track',

    columns: {
        defaults: {

        },
        items: [{
            text: 'ID',
            dataIndex: 'id',
            width: 80,
            align: 'right'
        },{
            text: 'Tid',
            dataIndex: 'time',
            width: 130,
            align: 'right'
        },{
            text: 'Navn',
            dataIndex: 'name',
            width: 150
        },{
            text: 'Terreng',
            dataIndex: 'terrain',
            width: 150
        },{
            text: 'Høyde',
            dataIndex: 'alt',
            width: 100,
            align: 'right'
        },{
            text: 'Distanse',
            dataIndex: 'x',
            width: 100,
            align: 'right'
        },{
            text: 'Lengdegrad',
            dataIndex: 'lng',
            width: 130,
            align: 'right',
            xtype: 'numbercolumn', 
            format:'0.00000'
        },{
            text: 'Breddegrad',
            dataIndex: 'lat',
            width: 130,
            align: 'right',
            xtype: 'numbercolumn', 
            format:'0.00000'
        },{
            text: 'Vær',
            dataIndex: 'weather',
            width: 100
        },{
            text: 'Temperatur',
            dataIndex: 'temp',
            width: 100,
            align: 'right'
        },{
            text: 'Nedbør',
            dataIndex: 'precip',
            width: 100,
            align: 'right'
        },{
            text: 'Vind',
            dataIndex: 'wind',
            width: 100
        },{
            text: 'Vindstyrke',
            dataIndex: 'wind_speed',
            width: 100,
            align: 'right'
        },{
            text: 'Vindsretning',
            dataIndex: 'wind_dir',
            width: 100
        }]
    },

    listeners: {
        itemclick: 'onClick',
        itemmouseenter: 'onMouseOver',
        scope: 'controller'
    }  
});