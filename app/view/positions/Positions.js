Ext.define('TrackApp.view.positions.Positions', {
    extend: 'Ext.grid.Panel',
    xtype: 'positions',

    requires: [
        'TrackApp.view.positions.PositionsController',
        'Ext.grid.column.Template',
        'Ext.grid.column.Number'
    ],

    controller: 'positions',

    store: 'Track',

    columns: {
        defaults: {

        },
        items: [{
            text: 'Tid',
            dataIndex: 'time',
            width: 130
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
            align: 'right',
            renderer: function (value) {
                return value + ' m';
            }            
        },{
            text: 'Distanse',
            dataIndex: 'x',
            width: 120,
            align: 'right',
            renderer: function (value) {
                return Math.round(value/1000) + ' km';
            }
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
            xtype: 'templatecolumn', 
            tpl: '<tpl if="weather"><img src="http://api.yr.no/weatherapi/weathericon/1.1/?symbol={weather};content_type=image/png" width="20" height="20"></tpl>',
            width: 60, 
            align: 'center'            
        },{
            text: 'Temperatur',
            dataIndex: 'temp',
            width: 90,
            align: 'right',
            renderer: function (value) {
                return (value !== null) ? value + '°C' : '';
            }            
        },{
            text: 'Nedbør',
            dataIndex: 'precip',
            width: 100,
            align: 'right',
            renderer: function (value) {
                return (value !== null) ? value + ' mm' : '';
            }            
        },{
            text: 'Vind',
            dataIndex: 'wind',
            width: 100
        },{
            text: 'Vindstyrke',
            dataIndex: 'wind_speed',
            width: 100,
            align: 'right',
            renderer: function (value) {
                return (value !== null) ? value + ' m/s' : '';
            }              
        },{
            text: 'Vindsretning',
            dataIndex: 'wind_dir',
            xtype: 'templatecolumn', 
            tpl: '{[{"N":"Nord","NE":"Nordøst","E":"Øst","SE":"Sørøst","S":"Sør","SW":"Sørvest","W":"Vest","NW":"Nordvest"}[values.wind_dir] || ""]}',
            width: 120
        }]
    },

    listeners: {
        itemclick: 'onClick',
        itemmouseenter: 'onMouseOver',
        scope: 'controller'
    }  
});