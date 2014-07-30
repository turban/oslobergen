Ext.define('TrackApp.model.Instagram', {
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
    }],    
    proxy: {  
        type: 'jsonp', 
        reader: {
            type: 'json',
            rootProperty: 'rows'
        }
    }
});
