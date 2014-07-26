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
			text: 'Høydeprofil',
			id: 'profile'
		},{
			text: 'Bilder',
			id: 'instagram'
		},{
			text: 'Posisjoner',
			id: 'positions'
		},{
			text: 'Facebook',
			id: 'facebook'
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
			hidden: true,
		},
		items: [{
			reference: 'profile',
			xtype: 'profile' 
		},{
			reference: 'instagram',
			xtype: 'instagram'			
		},{
			reference: 'positions',
			xtype: 'positions'
		}]  
	}]
});