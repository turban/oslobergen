Ext.define('TrackApp.config.Runtime',{
    singleton: true,
    config: {
        map: {
            bounds: [[59.9, 5.1], [60.9, 11.11]],
            options: {
                maxZoom: 16,
                minZoom: 6
            },
            start: {
                name: 'Lillogata',
                description: 'Start', 
                latlng: [59.94284, 10.76779]
            },
            end: {
                name: 'Nordåsgrenda',
                description: 'Mål', 
                latlng: [60.3096, 5.32355]
            }
        },
    	track: {
        	//feed_id: 'oslo-bergen-test',
        	feed_id: '0tCPC3101dltjyhgFTJi7m7FKNjm2Y2tc',
        	timestamp: null, 
        	url: Ext.create('Ext.XTemplate', "http://turban.cartodb.com/api/v2/sql?q=SELECT cartodb_id AS id, latitude AS lat, longitude AS lng, altitude AS alt, placename AS name, terrain, message_type AS type, timestamp, weather_symbol AS weather, temperature AS temp, precipitation AS precip, wind, wind_speed, wind_direction AS wind_dir FROM spot WHERE feed_id='{feed_id}' <tpl if='timestamp'>AND timestamp > {timestamp} </tpl>ORDER BY timestamp"),
        	interval: 5 // Minutes
        },
        instagram: {
        	timestamp: 1406487326,
        	url: Ext.create('Ext.XTemplate', "http://turban.cartodb.com/api/v2/sql?q=SELECT * FROM instagram <tpl if='timestamp'>WHERE timestamp > {timestamp} </tpl>ORDER BY timestamp DESC"),
        	interval: 5 // Minutes
        },
        gpx: {
            url: "http://turban.cartodb.com/api/v2/sql?q=SELECT latitude AS lat, longitude AS lng FROM gpx ORDER BY timestamp ASC"           
        }
    },
    constructor: function (config){
        this.initConfig(config);
    }
});