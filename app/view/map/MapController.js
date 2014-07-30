Ext.define('TrackApp.view.map.MapController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.map',

	baseLayers: [
		L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}', {
			name: 'Enkelt',
			attribution: '&copy; <a href="http://kartverket.no/">Kartverket</a>'
		}),
		L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
			name: 'Detaljert',
			attribution: '&copy; <a href="http://kartverket.no/">Kartverket</a>'
		})		
	],

	labelTemplate: new Ext.XTemplate('{name} {alt} moh.'),
	popupTemplate: new Ext.XTemplate( 
		'<tpl if="name"><p><strong>{name}</strong></tpl>', 
		'<tpl if="alt"><br>{terrain} {alt} moh.</p></tpl>',
		'<p>{time}</p>',
		'<tpl if="weather"><p><img src="http://api.yr.no/weatherapi/weathericon/1.1/?symbol={weather};content_type=image/png" width="38" height="38" style="float:right;">{temp}°C - {precip} mm<br>{wind},<br>{wind_speed} m/s fra {[{"N":"nord","NE":"nordøst","E":"øst","SE":"sørøst","S":"sør","SW":"sørvest","W":"vest","NW":"nordvest"}[values.wind_dir] || ""]}</p><p>Værdata fra <a href="http://api.yr.no">api.yr.no</a></p></tpl>'
	),
	miniPopupTemplate: new Ext.XTemplate('<tpl if="name">{name}<tpl else>{time}</tpl>'), 
	instaTemplate: new Ext.XTemplate('<a href="{link}" title="View on Instagram"><img src="{image_standard}" width="100%"/></a><p>{caption} {time}</a></p>'),

	control: {
		'#': {  // matches the view itself
			afterlayout: 'onAfterLayout',
			resize: 'onResize'
		}
	},

    listen: {
        controller: {
            '*': {
                showpoint:   'showMarker',
                hidepoint:   'hideMarker',
                selectpoint: 'selectMarker',
                mapbounds:   'setMapBounds',
                instashow:   'showInstagram',
                instahide:   'hideInstagram'
            }
        },
        store: {
            '*': {
                trackdata: 'onTrackData',
                addstop: 'addStop',
                instagram: 'onInstagram'
            }        	
        }
    },

	onAfterLayout: function () {
		if (!this.map) {
			this.createMap(this.getView().body.dom); 
			this.trackStore = Ext.StoreManager.lookup('Track');
 		}
	},

	onResize: function () {
		if (this.map) {
			this.map.invalidateSize();
		}
	},

	// Called on new track data
	onTrackData: function (data) {
		if (!this.polyline) { // First load
			this.firstDraw(data);
		} else {
			this.addTrackData(data);
		}
	},

	onInstagram: function (images) {
		for (var i = 0, len = images.length; i < len; i++) {
			this.instagram.addData([images[i].data]);
		}
	},

	createMap: function (id) {
		var mapConfig = TrackApp.config.Runtime.getMap()
			map = this.map = L.map(id, {
                minZoom: 4,				
                maxZoom: 16
            });

		map.attributionControl.setPrefix('');

		map.fitBounds(mapConfig.bounds);

		this.layersControl = L.control.layers().addTo(map);

		this.addBaseLayers(this.baseLayers);

        this.marker = L.circleMarker(null, { // Mouseover marker
            radius: 6,
            stroke: true,
            fillColor: '#333',
            fillOpacity: 1,
            weight: 25,
            opacity: 0
        });

        this.liveMarker = L.circleMarker(null, { // Latest position marker
            radius: 5,
            color: 'orange',
            fillColor: '#333',
            fillOpacity: 1,
            className: 'leaflet-marker-live'            
        });

		this.stops = L.featureGroup().addTo(this.map);

		if (mapConfig.start) {
			this.start = L.marker(mapConfig.start.latlng, {
				icon: L.MakiMarkers.icon({ 
                    icon: 'circle-stroked', 
                    color: '#145291', 
                    size: 'm' 
                })
			}).bindPopup('<strong>' + mapConfig.start.name + '</strong><br>' + mapConfig.start.description);
			map.addLayer(this.start);
		}

		if (mapConfig.end) {
			this.end = L.marker(mapConfig.end.latlng, {
				icon: L.MakiMarkers.icon({ 
                    icon: 'bar', 
                    color: '#145291', 
                    size: 'm' 
                })
			}).bindPopup('<strong>' + mapConfig.end.name + '</strong><br>' + mapConfig.end.description);
			map.addLayer(this.end);
		}

		this.instagram = L.instagram.cluster();

		this.instagram.on('click clusterclick', function (evt) {
			var layer = evt.layer, 
				gallery = []
				instagram;

			if (evt.type === 'click') {
				gallery.push(this.galleryItem(layer.instagram));
			} else {
				var photos = layer.getAllChildMarkers();
				for (var i = 0, len = photos.length; i < len; i++) {
					gallery.push(this.galleryItem(photos[i].instagram));
				}
			}

			$.fancybox(gallery, {
				helpers: { title: { type: 'inside' } },
				aspectRatio: true,
				autoSize: false,
				width: 640,
				height: 640
			});	
		}, this);

		this.gpx = L.polyline([], { 
            opacity: 0.8,
            weight: 3      
        });

		this.layersControl.addOverlay(this.stops, 'Overnatting');
		this.layersControl.addOverlay(this.instagram, 'Bilder');	
		this.layersControl.addOverlay(this.gpx, 'GPS-spor');	

		this.map.on('overlayadd', this.onOverlayAdd, this);	
	},

	firstDraw: function (data) {
		this.polyline = L.polyline(data, { 
            color: '#333',
            opacity: 0.8,
            weight: 3,
            dashArray: [5,5]       
        }).addTo(this.map);

		this.hitPolyline = L.polyline(data, {
			opacity: 0,
            weight: 35
		}).addTo(this.map);

		this.map.fitBounds(this.polyline.getBounds()); 
        this.map.on('drag', this.onBoundsChange, this);
        this.map.on('zoomend', this.onBoundsChange, this);

		this.hitPolyline.on('click', this.onLineClick, this);
		this.hitPolyline.on('mousemove', this.onMouseMove, this);
		this.hitPolyline.on('mousemout', this.onMouseOut, this);

		this.marker.on('mousemove', this.onMouseMove, this);
		this.marker.on('mouseout', this.onMouseOut, this);
		this.marker.on('click', this.onMarkerClick, this);

		this.liveMarker.on('mousemove', this.onMouseMove, this);
		this.liveMarker.on('mouseout', this.onMouseOut, this);
		this.liveMarker.on('click', this.onMarkerClick, this);

		this.stops.on('mouseover', this.onMouseMove, this);
		this.stops.on('mouseout', this.onMouseOut, this);
		this.stops.on('click', this.onStopClick, this);

		this.marker.bindLabel('');

		this.map.addLayer(this.liveMarker.setLatLng(data[data.length - 1]));
		this.liveMarker.data = data;
	},

	addTrackData: function (data) {
		var point;
		for (var i = 0, len = data.length; i < len; i++) {
			point = data[i];
            this.polyline.addLatLng(point); 
            this.hitPolyline.addLatLng(point);
		}
		this.liveMarker.setLatLng(point);
		this.liveMarker.data = data;
	},

	addStop: function (stop) {
		var marker = L.marker(stop, {
			icon: L.MakiMarkers.icon({ 
            	icon: (stop.type === 'OK') ? 'building' : 'campsite', 
                color: '#145291', 
                size: 'm' 
            })	
		}).bindPopup('Popup!');
		marker.data = stop;

		this.stops.addLayer(marker);
	},

	addBaseLayers: function (layers) {
		for (var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			this.layersControl.addBaseLayer(layer, layer.options.name); 
		}
		layers[0].addTo(this.map);
	},

	galleryItem: function (data) {
		if (data.type === 'video' && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
			return {
				type: 'inline',
				content: '<video autoplay controls poster="' + data.image_standard + '"><source src="' + data.video_standard + '" type="video/mp4"/></video>',
				title: data.caption + '<span style="color:#aaa;"> - ' + data.time + '</span>'
			};	
		}
		return {
			href: data.image_standard,
			title: data.caption + '<span style="color:#aaa;"> - ' + data.time + '</span>'
		};	
	},

	onLineClick: function (evt) {
		var nearestPoint = this.getPointFromPosition(evt.latlng);
		this.showPopup(this.showMarker(nearestPoint));
		this.fireEvent('mappointshow', nearestPoint);
	},

	onMouseMove: function (evt) {
		var nearestPoint = this.getPointFromPosition(evt.latlng);
		this.showLabel(this.showMarker(nearestPoint));
        this.fireEvent('mappointshow', nearestPoint);
	},

	onMouseOut: function () {
		this.map.removeLayer(this.marker);
        this.fireEvent('mappointhide', this.marker.data);
	},

	onMarkerClick: function (evt) {
		this.showPopup(evt.target);
	},

	onStopClick: function (evt) {
		this.showPopup(evt.layer);
	},

	onBoundsChange: function () {
		var bounds = this.map.getBounds();
		this.fireEvent('mapboundschange', [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
	},

	onOverlayAdd: function (evt) {
		if (evt.layer === this.gpx && !this.gpx.getLatLngs().length) {
			var self = this;
			Ext.data.JsonP.request({
				url: 'http://turban.cartodb.com/api/v2/sql?q=SELECT latitude AS lat, longitude AS lng FROM gpx ORDER BY timestamp ASC',
				success: function(data) {
					self.gpx.setLatLngs(data.rows);
				}
			});
		}
	},

	showMarker: function (point) {
		this.marker.setLatLng(point).addTo(this.map);
		this.marker.data = point;

        if (!this.map.getBounds().contains(L.latLng(point))) {
            this.map.panTo(point, {
                animate: true,
                duration: 1
            });
        }

        this.marker.closePopup();
		return this.marker;
	},

	hideMarker: function (point) {
		this.map.removeLayer(this.marker);
		return this.marker;
	},

	selectMarker: function (point, miniPopup) {
		var marker = this.showMarker(point);
		if (!miniPopup) {
			this.showPopup(marker);
		} else {
			marker.bindPopup(this.miniPopupTemplate.apply(marker.data)).openPopup();
			marker.hideLabel();			
		}
	},

	showLabel: function (marker) {
		if (marker.data.alt !== null) {
			marker.label.setLatLng(marker.data);
			marker.updateLabelContent(this.labelTemplate.apply(marker.data)); 
			marker.showLabel();
		} else {
			marker.hideLabel();
		}
	},

	showPopup: function (marker) {
		console.log(marker.data);
		marker.bindPopup(this.popupTemplate.apply(marker.data)).openPopup();
		marker.hideLabel();
	},

    // Get closest point to lat/lng position
    getPointFromPosition: function (latlng) {
        return this.trackStore.knnData(latlng.lat, latlng.lng, 1)[0];
    },

    setMapBounds: function (bounds) {
    	this.map.fitBounds([[bounds[1],bounds[0]],[bounds[3],bounds[2]]]);
    },

    showInstagram: function () {
    	this.map.removeLayer(this.stops);
    	this.map.removeLayer(this.start);
    	this.map.removeLayer(this.end);    	    	
    	this.map.addLayer(this.instagram);
    },

    hideInstagram: function () {
    	this.map.removeLayer(this.instagram); 
    	this.map.addLayer(this.stops);  
    	this.map.addLayer(this.start);  
    	this.map.addLayer(this.end);      	    	 	
    }

});