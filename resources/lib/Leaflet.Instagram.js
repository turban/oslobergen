L.Instagram = L.FeatureGroup.extend({
	options: {
		icon: {						
			iconSize: [40, 40],
			className: 'leaflet-marker-instagram'
		}
	},

	initialize: function (options) {
		L.setOptions(this, options);
		L.FeatureGroup.prototype.initialize.call(this);
	},

	addLayers: function (images) {
		for (var i = 0, len = images.length; i < len; i++) {
			this.addLayer(images[i]);
		}
		return this;
	},

	createMarker: function (image) {
		var marker = L.marker([image.latitude, image.longitude], {
			icon: L.icon(L.extend({
				iconUrl: image.image_thumb		
			}, this.options.icon)),
			title: image.caption || ''
		});		
		marker.instagram = image;
		return marker;
	},

	addLayer: function (image) {	
		L.FeatureGroup.prototype.addLayer.call(this, this.createMarker(image));
	}
});

L.instagram = function (options) {
	return new L.Instagram(options);
};

L.Instagram.Cluster = L.MarkerClusterGroup.extend({
	options: {
		featureGroup: L.instagram,		
		maxClusterRadius: 95,		
		showCoverageOnHover: false,
		zoomToBoundsOnClick: false,
		iconCreateFunction: function(cluster) {
			var marker = cluster.getAllChildMarkers()[0],
				iconUrl = marker.instagram.image_thumb;
		
			return new L.DivIcon({
				className: 'leaflet-cluster-instagram',  
				html: '<img src="' + iconUrl + '"><b>' + cluster.getChildCount() + '</b>' 
			});
	   	}		
	},

	initialize: function (options) {	
		options = L.Util.setOptions(this, options);
		L.MarkerClusterGroup.prototype.initialize.call(this);
		this._instagram = options.featureGroup(options);
	},

	addData: function (images) {
		this.addLayer(this._instagram.addLayers(images));
		return this;
	}
});

L.instagram.cluster = function (options) {
	return new L.Instagram.Cluster(options);	
};