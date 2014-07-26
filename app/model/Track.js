Ext.define('TrackApp.model.Track', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.JsonP'
    ],
    fields: [{
        name: 'time',
        mapping: 'timestamp',
        convert: function (timestamp) {
            return Ext.Date.format(new Date(timestamp * 1000), 'j/n k\\l. H:i');
        },
        sortType: function(time) {
            return Ext.Date.parse(time, 'j/n k\\l. H:i').getTime();
        }        
    },{
        name: 'x',
        defaultValue: 0
    }],
    proxy: {  
        type: 'jsonp',
        reader: {
            type: 'json',
            rootProperty: 'rows'
        }
    }
});