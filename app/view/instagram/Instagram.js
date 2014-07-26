Ext.define('TrackApp.view.instagram.Instagram', {
    extend: 'Ext.view.View',
    requires: [
        'TrackApp.view.instagram.InstagramController'
    ],
    xtype: 'instagram',
    controller: 'instagram',
    store: 'Instagram',
    tpl: new Ext.XTemplate('<tpl for="."><img src="{image_low}"/></tpl>'),
	cls: 'instagram',
    itemSelector: 'img',
    emptyText: 'Ingen bilder',
    overflowX: 'auto',
    listeners: {
        itemclick: 'onImageClick',
        scope: 'controller'
    }        
});