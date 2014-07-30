Ext.define('TrackApp.view.profile.ProfileController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.profile',
    requires: [
        'TrackApp.store.Track'
    ],

    chartOptions: { // Highcharts options
        chart: {
            type: 'areaspline',
            plotBorderWidth: 1,   
            zoomType: 'x' ,                
            resetZoomButton: {
                theme: {
                    display: 'none'
                }                   
            },
            animation: false,
            events: {},
            marginTop: 20                
        },
        title: {
            text: null
        },
        credits: {
            enabled: false
        },       
        xAxis: {
            minPadding: 0,
            maxPadding: 0,
            reversed: true,
            labels: {
                formatter: function () {
                    return Math.round(this.value / 1000) + ' km';
                }
            }           
        },
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },                
            min: 0
        }, {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },                   
            opposite: true,
            linkedTo: 0
        }],
        legend: {
            enabled: false
        },
        tooltip: {},
        plotOptions: {
            series: {
                cursor: 'pointer',
                animation: false,
                marker: {
                    enabled: false
                },
                point: {
                    events: {}
                }
            }
        },  
        series: [{}]
    },

    tooltipTemplate: Ext.create('Ext.XTemplate', '{name} {alt} moh.<br>{time}'),

	control: {
		'#': {  // matches the view itself
			afterlayout: 'onAfterLayout',
			resize: 'onResize'
		}
	},

    listen: {
        controller : {
            '*' : {
                mapboundschange: 'zoomToBounds',
                mappointshow: 'onMapPointShow',
                mappointhide: 'onMapPointHide'
            }
        },
        store: {
            '*': {
               trackdata: 'onTrackData'
            }           
        }        
    },

	onAfterLayout: function () {
		if (!this.chart) {
			//this.createChart(this.getView().body.dom, this.chartOptions); 
		}
	},

	onResize: function () {
		if (this.chart) {
			this.chart.reflow();
		}
	},

    onChartClick: function (point) {
        this.fireEvent('selectpoint', this.trackStore.getPointFromDistance(point.x));
    },

    onChartMouseOver: function (point) {
        this.fireEvent('showpoint', this.trackStore.getPointFromDistance(point.x));
    },

    onChartMouseOut: function (point) {
        this.fireEvent('hidepoint', this.trackStore.getPointFromDistance(point.x));
    },

    onMapPointShow: function (mapPoint) {
        if (this.getView().isVisible() && mapPoint.i !== undefined) {
            if (this.point) {
                this.point.setState();
            }            
            this.point = this.chart.series[0].data[mapPoint.i];
            this.point.setState('hover');
        }
    },

    onMapPointHide: function (mapPoint) {
        if (this.getView().isVisible() && this.point) {
            this.point.setState();
            delete (this.point);
        }   
    },

    onChartSelection: function (evt) {
        if (evt.xAxis) {
            this.fireEvent('mapbounds', this.trackStore.getBoundsFromDistance(evt.xAxis[0].min, evt.xAxis[0].max));
        }
    },

    onTrackData: function (data) {
        if (!this.chart) {
            this.createChart(data);
        } else {
            this.addData(data);
        }
    },

    createChart: function (data) {
        var domEl       = this.getView().body.dom, 
			chart       = this.chartOptions,
			series      = [],
            plotLines   = [],
            self        = this,
            prevPoint;

        this.seriesCount = 0;

        // Create data series and plot lines
        for (var i = 0, len = data.length; i < len; i++) {
            var point = data[i];

            if (point.alt !== null) { 
                point.i = this.seriesCount++;          
                series.push([point.x, point.alt]);
                prevPoint = point;    
            } else {
                point.i = -1;
            }
            if (point.type !== 'UNLIMITED-TRACK') { // TODO: Create option
                plotLines.push(this.getPlotLine(point));
            }
        }

        chart.chart.renderTo = domEl;
        chart.series[0].data = series;   
        chart.xAxis.plotLines = plotLines; 

        chart.chart.events.selection = function (evt) { self.onChartSelection(evt); return false; };
        chart.tooltip.formatter = function () { return self.showTooltip(this); };
        chart.plotOptions.series.point.events.click = function () { self.onChartClick(this); };
        chart.plotOptions.series.point.events.mouseOver = function () { self.onChartMouseOver(this); };
        chart.plotOptions.series.point.events.mouseOut = function () { self.onChartMouseOut(this); };        

        this.chart = new Highcharts.Chart(chart);

        this.trackStore = Ext.StoreManager.lookup('Track');

        //this.createFilters(data);
	},

    addData: function (data) {
        var chart     = this.chart,
            series    = chart.series[0],
            xAxis     = chart.xAxis[0],
            max       = (xAxis.max === series.data[series.data.length-1].x); // True if chart shows max distance

        var point; 
        for (var i = 0, len = data.length; i < len; i++) {
            point = data[i];
            if (point.alt !== null) { 
                point.i = this.seriesCount++;       
                series.addPoint([point.x, point.alt], false); // Add point to chart
                if (point.type !== 'UNLIMITED-TRACK') { // TODO: Create option
                    xAxis.addPlotLine(this.getPlotLine(point));
                }             
            } else {
                point.i = -1;
            }

        }

        this.chart.redraw(); // Redraw chart after all new points are added

        if (max) { // Expand chart if max value is shown
            xAxis.setExtremes(xAxis.min, point.x);
            this.chart.showResetZoom();
        }
    },

    // Add points to chart series
    addPoints: function (points) {
        for (var i = 0, len = points.length, point; i < len; i++) {
            

        }   
    },

    // Chart tooltip function
    showTooltip: function (point) {
        return this.tooltipTemplate.apply(this.trackStore.getPointFromDistance(point.x))
    },

    // Calculate distance between points
    getDistance: function (point, prevPoint) {
        //console.log("#", point, prevPoint);
        if (prevPoint) {
            return prevPoint.x + Math.round(L.latLng(point).distanceTo(L.latLng(prevPoint)));
        }
        return 0;
    },

    // Chart: Create plotline for one point - TODO: Add names for if space
    getPlotLine: function (point) {
        return L.extend({
            value: point.x
            //label: { text: point.name || '' },
        }, { 
            width: 1,
            color: '#333',
            dashStyle: 'Dot',
            zIndex: 5
        });
    },

    // Zoom chart to map boiunds (west, south, east, north)
    zoomToBounds: function (bounds) {
        if (this.getView().isVisible()) {
            var distance = this.trackStore.getDistanceFromBounds(bounds);
            if (distance) {
                this.chart.xAxis[0].setExtremes(distance[0], distance[1]);
                this.chart.showResetZoom();
            }

            if (this.point) {
                this.point.setState();
                delete (this.point);
            }  
        }   
    }

});