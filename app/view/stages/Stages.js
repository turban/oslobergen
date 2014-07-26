Ext.define('TrackApp.view.stages.Stages', {
    extend: 'Ext.grid.Panel',
    xtype: 'stages',

    requires: [
        'TrackApp.view.stages.StagesController'
    ],

    controller: 'stages',

    store: 'Stages',

    columns: [{
        text: 'Dato',
        dataIndex: 'date',
        width: 70
    },{
        text: 'Startsted',
        dataIndex: 'start',
        width: 150
    },{
        text: 'Sluttsted',
        dataIndex: 'end',
        width: 150
    },{
        text: 'Distanse',
        dataIndex: 'distance',
        width: 100
    },{
        text: 'Starttid',
        dataIndex: 'start_time',
        width: 80
    },{
        text: 'Sluttid',
        dataIndex: 'end_time',
        width: 80
    },{
        text: 'Tid',
        dataIndex: 'time',
        width: 80
    },{
        text: 'Laveste punkt',
        dataIndex: 'lowest',
        width: 135
    },{
        text: 'Høyeste punkt',
        dataIndex: 'highest',
        width: 135
    }]

    /*
    listeners: {
        itemclick: 'onClick',
        itemmouseenter: 'onMouseOver',
        scope: 'controller'
    } 
    */ 
});