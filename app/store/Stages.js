Ext.define('TrackApp.store.Stages', {
    extend: 'Ext.data.Store',
    requires: [ 
        'TrackApp.model.Stage' 
    ],
    storeId: 'Stages', 
    model: 'TrackApp.model.Stage'
});
