Ext.define('TrackApp.view.map.MapController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.map',

	mapOptions: {
	},

	mapBounds: [[59.9, 5.1], [60.9, 11.11]],

	baseLayers: [
		L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}', {
			name: 'Bright',
			attribution: '&copy; <a href="http://kartverket.no/">Kartverket</a>'
		}),
		L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
			name: 'Detailed',
			attribution: '&copy; <a href="http://kartverket.no/">Kartverket</a>'
		}),
		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			name: 'OpenStreetMap',
			attribution: '&copy; a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		})		
	],

	control: {
		'#': {  // matches the view itself
			afterlayout: 'onAfterLayout',
			resize: 'onResize'
		}
	},

	onAfterLayout: function () {
		this.createMap(this.getView().body.dom, this.mapOptions); 
	},

	onResize: function () {
		if (this.map) {
			this.map.invalidateSize();
		}
	},

	createMap: function (id, options) {
		var map = this.map = L.map(id, options); 
		map.attributionControl.setPrefix('');

		map.fitBounds(this.mapBounds);

		this.addBaseLayers(this.baseLayers);
	},

	addBaseLayers: function (layers) {
		var menu = this.lookupReference('baseLayers').menu;
		for (var i = 0; i < layers.length; i++) {
			var layer = layers[i];

			menu.add({
				text: layer.options.name,
				layer: layer
			});
		}
		this.baseLayer = layers[0].addTo(this.map);
	},

	onBaseLayerClick: function (menu, item) {
		if (this.baseLayer !== item.layer) {
			this.map.removeLayer(this.baseLayer);
			this.baseLayer = item.layer.addTo(this.map);
		}
	}

});