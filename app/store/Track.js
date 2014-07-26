Ext.define('TrackApp.store.Track', {
    extend: 'Ext.data.Store',
    requires: [ 
        'TrackApp.model.Track' 
    ],
    storeId: 'Track', 
    model: 'TrackApp.model.Track',
    listeners: {
        'beforeload': 'beforeLoad',   
        'load': 'onLoad'
    },
    autoLoad: true,

    // Update CartoDB URL before load
    beforeLoad: function () {
        var track = TrackApp.config.Runtime.getTrack();
        this.getProxy().setUrl(track.url.apply(track));     
    }, 

    // Calculate distance between points
    onLoad: function (store, points) {
        var rawData = this.getProxy().getReader().rawData.rows,
            track = TrackApp.config.Runtime.getTrack(),
            point,
            self = this;

        if (!this.rawData) { // First load
            this.rawData = rawData;
            setInterval(function() { self.load({ addRecords: true }); }, track.interval * 60000);           
        } else {
            Ext.Array.push(this.rawData, rawData);
        }

        for (var i = 0, len = points.length, date; i < len; i++) {
            point = points[i].data,
            //point.set('x', this.getDistance(point.data, this.prevPoint)); // Gives error in Grid
            point.x = this.getDistance(point, this.prevPoint);
            this.prevPoint = point;  
        }

        if (points.length) {
            this.knnData = sphereKnn(this.rawData); // TODO: Possible to add data

            if (!this.crossfilter) {
                this.createFilters(rawData);
            } else {
                this.crossfilter.add(rawData);
            }
            track.timestamp = point.timestamp;
            this.fireEvent('trackdata', rawData);
        } 
    },

    // Calculate distance between points
    getDistance: function (point, prevPoint) {
        if (prevPoint) {
            return prevPoint.x + Math.round(L.latLng(point).distanceTo(L.latLng(prevPoint)));
        }
        return 0;
    },

    getRawData: function () {
        return this.rawData;
    },

    // Crossfilter: Create distance, latitude and longitude dimensions
    createFilters: function (data) {
        var filter = this.crossfilter = crossfilter(data);
        this.filters = {
            byDist: filter.dimension(function(d) { return d.x; }),
            byLat:  filter.dimension(function(d) { return d.lat; }),
            byLng:  filter.dimension(function(d) { return d.lng; })
        }; 
    },

    // Crossfilter: Clear filters for all dimensions
    // Todo: Is there a better way to do this?
    clearFilters: function () {
        this.filters.byDist.filterAll();
        this.filters.byLat.filterAll();
        this.filters.byLng.filterAll();
        return this.filters;
    },

    // Crossfilter: Get point from distance
    getPointFromDistance: function (distance) {
        this.clearFilters();
        this.filters.byDist.filter(distance);
        return this.filters.byDist.bottom(1)[0];        
    },

    // Crossfilter: Get min and max distance from map bounds
    getDistanceFromBounds: function (bounds) {
        var filters = this.clearFilters();

        filters.byLat.filter([bounds[1], bounds[3]]);
        filters.byLng.filter([bounds[0], bounds[2]]);

        if (filters.byDist.bottom(1).length) {
            return [filters.byDist.bottom(1)[0].x, filters.byDist.top(1)[0].x];
        }
    },       

    // Get map bounds from min and max distance
    getBoundsFromDistance: function (min, max) {
        var filters = this.clearFilters();
        filters.byDist.filter([min, max]);
        if (filters.byLat.bottom(1)[0]) {
            return  [filters.byLng.bottom(1)[0].lng, filters.byLat.bottom(1)[0].lat, filters.byLng.top(1)[0].lng, filters.byLat.top(1)[0].lat];       
        }
    }
});

