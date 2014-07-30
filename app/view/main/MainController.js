Ext.define('TrackApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox'
    ],

    alias: 'controller.main',

    control: {
        '#': {  
            afterlayout: 'onAfterLayout'
        },        
        button: {
            click: 'onButtonClick'
        }
    },

    onAfterLayout: function () {
        if (L.Browser.touch) {
            this.lookupReference('facebookBtn').hide();
            this.lookupReference('instagramBtn').hide();
        }
    },

    onButtonClick: function (item) {   
        var panel = this.lookupReference(item.id),
            bottom = this.lookupReference('bottom');

        if (panel || item.id === 'instagram') {
            if (this.activePanel) {
                this.activePanel.hide();
            }
            if (item.pressed && panel) {
                bottom.show();
                panel.show();
                this.activePanel = panel;  
            } else {
                bottom.hide();
                this.activePanel = null;
            }
            this.fireEvent(item.pressed && item.id === 'instagram' ? 'instashow' : 'instahide');

        } else if (item.id === 'facebookUrl') {
            item.setPressed(false);
            bottom.hide();
            window.open('https://www.facebook.com/groups/oslo.bergen/');
        } else if (item.id === 'instagramUrl') {
            item.setPressed(false);
            bottom.hide();
            window.open('http://instagram.com/instanturban');
        }
    }
});
