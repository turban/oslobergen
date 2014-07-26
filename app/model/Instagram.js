Ext.define('TrackApp.model.Instagram', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.JsonP'
    ],
    proxy: {  
        type: 'jsonp', 
        reader: {
            type: 'json',
            rootProperty: 'rows'
        }
    }
});
