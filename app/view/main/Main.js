Ext.define('TrackApp.view.main.Main', {
	extend: 'Ext.panel.Panel',

    requires: [
        'Ext.resizer.Splitter'
    ],

	xtype: 'app-main',
	
	controller: 'main',

	viewModel: {
		type: 'main'
	},

	title: 'Oslo-Bergen til fots',

	header: {
		titlePosition: 0,
		defaults: {
			xtype: 'button',
			toggleGroup: 'menu'
		},
		items: [{
			text: 'Bilder',
			id: 'instagram'
		},{
			text: 'Høydeprofil',
			id: 'profile'
		},{
			text: 'Posisjon',
			id: 'positions'
		},{
			text: 'Facebook',
			id: 'facebookUrl',
			reference: 'facebookBtn'
		},{
			text: 'Instagram',
			id: 'instagramUrl',
			reference: 'instagramBtn'
		}]
	},

	layout: {
		type: 'vbox',
		pack: 'start',
		align: 'stretch'
	},

	items: [{
		reference: 'map',
		xtype: 'map',
		flex: 3
	}, {
		reference: 'bottom',
		xtype: 'panel',
		flex: 2,
		//split: true,
		hidden: true,
		layout: {
			type: 'fit'
		},
		defaults: {
			hidden: true
		},
		items: [{
			reference: 'profile',
			xtype: 'profile' 
		},{
			reference: 'positions',
			xtype: 'positions'
		}]  
	}]
});