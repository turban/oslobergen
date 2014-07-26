Ext.define('TrackApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox'
    ],

    alias: 'controller.main',

    control: {
        button: {
            click: 'onButtonClick'
        }
    },

    onButtonClick: function (item) {   
        var panel = this.lookupReference(item.id),
            bottom = this.lookupReference('bottom');

        if (panel) {
            if (this.activePanel) {
                this.activePanel.hide();
            }
            if (item.pressed) {
                bottom.show();
                panel.show();
                this.activePanel = panel;  
            } else {
                bottom.hide();
                this.activePanel = null;
            }
        } else if (item.id === 'facebook') {
            window.open('https://www.facebook.com/groups/oslo.bergen/');
            item.setPressed(false);
        }
    }
});
