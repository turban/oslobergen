Ext.define('TrackApp.view.instagram.InstagramController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.instagram',

	onImageClick: function (view, record, item, index) {
		var store = Ext.StoreManager.lookup('Instagram'),
			gallery = [],
			self = this;

		store.each(function(image) {
		    gallery.push(self.galleryItem(image.data));
		});

		$.fancybox(gallery, {
			helpers: { title: { type: 'inside' } },
			aspectRatio: true,
			autoSize: false,
			width: 640,
			height: 640,
			index: index
		});	
	},

	galleryItem: function (data) {
		if (data.type === 'video' && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
			return {
				type: 'inline',
				content: '<video autoplay controls poster="' + data.image_standard + '"><source src="' + data.video_standard + '" type="video/mp4"/></video>',
				title: data.caption
			};	
		}
		return {
			href: data.image_standard,
			title: data.caption
		};	
	}

});