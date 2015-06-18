define(function() {

    var FX_CDN = '//fenixrepo.fao.org/cdn',
        FX_CHART = 'submodule/fenix-ui-chart-creator/src/';

    return {

        paths: {

            Config:     "config/config",

            WDSClient: "submodule/fenix-ui-common/js/WDSClient",

            i18n:       FX_CDN + "/js/requirejs/plugins/i18n/2.0.4/i18n",
            text:       FX_CDN + "/js/requirejs/plugins/text/2.0.12/text",
            jquery:     FX_CDN + "/js/jquery/2.1.1/jquery.min",
            domReady:   FX_CDN + "/js/requirejs/plugins/domready/2.0.1/domReady",
            bootstrap:  FX_CDN + "/js/bootstrap/3.3.4/js/bootstrap.min",
            chosen:     FX_CDN + "/js/chosen/1.2.0/chosen.jquery.min",
            highcharts: FX_CDN + "/js/highcharts/4.0.4/js/highcharts", //'//code.highcharts.com/highcharts',
            underscore: FX_CDN + "/js/underscore/1.7.0/underscore.min",
            handlebars: FX_CDN + "/js/handlebars/2.0.0/handlebars",
            amplify:    FX_CDN + "/js/amplify/1.1.2/amplify.min",
            csvjson:    FX_CDN + "/js/csvjson/1.0/csvjson",
            q:          FX_CDN + "/js/q/1.1.2/q",

            'sweetAlert':   FX_CDN + '/js/sweet-alert/0.4.2/sweet-alert',

            // fenix-map-js
            'leaflet':      FX_CDN + '/js/leaflet/0.7.3/leaflet',
            'jquery-ui':    FX_CDN + '/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',                
            'import-dependencies':    FX_CDN + '/js/FENIX/utils/import-dependencies-1.0',
            'jquery.power.tip':       FX_CDN + '/js/jquery.power.tip/1.2.0/jquery.powertip.min',
            'jquery.i18n.properties': FX_CDN + '/js/jquery/1.0.9/jquery.i18n.properties-min',
            'jquery.hoverIntent':     FX_CDN + '/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',

            'fenix-ui-map':           FX_CDN + '/js/fenix-ui-map/0.1/fenix-ui-map.min',
            'fenix-ui-map-config':    FX_CDN + '/js/fenix-ui-map/0.1/fenix-ui-map-config',

            'fx-flude-ui/start':  'js/start',
            'fx-flude-ui/html':   './html',
            'fx-flude-ui/nls':    './nls',

            'fx-c-c/start':     FX_CHART + 'js/start',
            'fx-c-c/html':      FX_CHART + 'html',
            'fx-c-c/config':    FX_CHART + '../config',
            'fx-c-c/adapters':  FX_CHART + 'js/adapters',
            'fx-c-c/templates': FX_CHART + 'js/templates',
            'fx-c-c/creators':  FX_CHART + 'js/creators'
        },

        shim: {
            bootstrap: ["jquery"],
            highcharts: ['jquery'],
            chosen: ['jquery'],
            amplify: ['jquery'],
            underscore: {
                exports: '_'
            },
            handlebars: {
                exports: 'Handlebars'
            },

            WDSClient: ['jquery'],

            'jquery-ui': ['jquery'],
            'jquery.hoverIntent': ['jquery'],
            'jquery.power.tip': ['jquery'],
            'jquery.i18n.properties': ['jquery'],
            'jquery.hoverIntent': ['jquery'],
            'fenix-ui-map': {
                deps: [
                    'jquery',
                    'jquery-ui',
                    'leaflet',
                    'fenix-ui-map-config',
                    'jquery.power.tip',
                    'jquery.i18n.properties',
                    'import-dependencies',
                    'jquery.hoverIntent',
                    'chosen'
                ]
            }
        }
    };
});