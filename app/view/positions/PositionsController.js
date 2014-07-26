Ext.define('TrackApp.view.positions.PositionsController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.positions',

	onClick: function (grid, point) {
		this.fireEvent('selectpoint', point.data, true);
	},

	onMouseOver: function (grind, point) {
		this.fireEvent('showpoint', point.data);
	}

});