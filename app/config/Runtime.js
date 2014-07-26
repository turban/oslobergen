Ext.define('TrackApp.config.Runtime',{
    singleton: true,
    config: {
    	track: {
        	//feed_id: 'oslo-bergen-test',
        	feed_id: '0eYy5KAjmK7qeWqpZAnBGqgTdgZYOGtIS',
        	timestamp: null, 
        	url: Ext.create('Ext.XTemplate', "http://turban.cartodb.com/api/v2/sql?q=SELECT cartodb_id AS id, latitude AS lat, longitude AS lng, altitude AS alt, placename AS name, terrain, message_type AS type, timestamp, weather_symbol AS weather, temperature AS temp, precipitation AS precip, wind, wind_speed, wind_direction AS wind_dir FROM spot WHERE feed_id='{feed_id}' <tpl if='timestamp'>AND timestamp > {timestamp} </tpl>ORDER BY timestamp"),
        	interval: 5 // Minutes
        },
        instagram: {
        	timestamp: 1406317650,
        	url: Ext.create('Ext.XTemplate', "http://turban.cartodb.com/api/v2/sql?q=SELECT * FROM instagram <tpl if='timestamp'>WHERE timestamp > {timestamp} </tpl>ORDER BY timestamp DESC"),
        	interval: 5 // Minutes
        }
    },
    constructor: function (config){
        this.initConfig(config);
    }
});