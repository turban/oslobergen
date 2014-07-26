Ext.define('TrackApp.store.Instagram', {
    extend: 'Ext.data.Store',
    requires: [ 
        'TrackApp.model.Instagram' 
    ],
    storeId: 'Instagram', 
    model: 'TrackApp.model.Instagram',
    listeners: {
        'beforeload': 'beforeLoad',   
        'load': 'onLoad'
    },
    autoLoad: true,

    // Update CartoDB URL before load
    beforeLoad: function () {
        var insta = TrackApp.config.Runtime.getInstagram();
        this.getProxy().setUrl(insta.url.apply(insta));     
    },     

    onLoad: function (store, images) {
    	var insta = TrackApp.config.Runtime.getInstagram(),
    		self = this;

    	if (!this.loaded) { // First load
    		setInterval(function() { self.load({ addRecords: true }); }, insta.interval * 60000);   
    		this.loaded = true;
    	}

    	if (images.length) {
    		insta.timestamp = images[0].data.timestamp;
    		this.fireEvent('instagram', images);
    	}
    }

});

