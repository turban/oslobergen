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
        var stagesStore = Ext.StoreManager.lookup('Stages'), 
            rawData = this.getProxy().getReader().rawData.rows,
            track = TrackApp.config.Runtime.getTrack(),
            stage,
            point,
            self = this;

        if (!this.rawData) { // First load
            this.rawData = rawData;
            this.stageDistance = 0;
            setInterval(function() { self.load({ addRecords: true }); }, track.interval * 60000);           
        } else {
            Ext.Array.push(this.rawData, rawData);
        }

        for (var i = 0, len = points.length, date; i < len; i++) {
            point = points[i].data,
            //point.set('x', this.getDistance(point.data, this.prevPoint)); // Gives error in Grid
            point.x = this.getDistance(point, this.prevPoint);

            if (this.prevPoint) {
                this.stageDistance += Math.round(L.latLng(point).distanceTo(L.latLng(this.prevPoint)));
            }

            date = new Date(point.timestamp * 1000).getDate();

            if (date !== this.prevDate) {
                stage = stagesStore.add({
                    date: Ext.Date.format(new Date(point.timestamp * 1000), 'j/n'),
                    start: point.name,
                    start_time: point.timestamp
                })[0];

                if (this.prevStage) {
                   this.prevStage.set('end', this.prevPoint.name);  
                   this.prevStage.set('distance', this.stageDistance);
                   this.prevStage.set('end_time', this.prevPoint.timestamp);
                   this.stageDistance = 0;                
                }

                this.prevStage = stage;
            }

            this.prevPoint = point;  
            this.prevDate = date;
        }

        if (stage && point) {
            stage.set('end', point.name);
            stage.set('distance', this.stageDistance);
        }

        if (points.length) {
            this.knnData = sphereKnn(this.rawData); // TODO: Possible to add data

            if (!this.crossfilter) {
                this.createFilters(rawData);
            } else {
                this.crossfilter.add(rawData);
            }

            this.crossfilter.add(rawData);
            track.cartodb_id = this.prevPoint.id;
            this.fireEvent('trackdata', rawData);

            //this.getStages();

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
            byLng:  filter.dimension(function(d) { return d.lng; }),
            byTime: filter.dimension(function(d) { return d.timestamp; })
        }; 
    },

    // Crossfilter: Clear filters for all dimensions
    // Todo: Is there a better way to do this?
    clearFilters: function () {
        this.filters.byDist.filterAll();
        this.filters.byLat.filterAll();
        this.filters.byLng.filterAll();
        this.filters.byTime.filterAll();
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
    },

    getStages: function () {
        console.log("getStages", this.stages);

        //for (var i = 0, len = this.stages; i < len; i++) {   
        //}

        var first = this.stages[0].timestamp,
            last = this.stages[1].timestamp-1;


    }

});

