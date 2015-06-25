define([
    'jquery','underscore','bootstrap','handlebars','jstree','bootstrapslider',
    'Config',
    'Codelists',
    'WDSClient',
    'text!html/map.html',
    'text!fx-ui-table',    
    'fenix-ui-map'
], function (
    $, _, bootstrap, Handlebars, jstree, bootstrapslider,
    Config,
    Codelists,
    WDSClient,
    tmplMap,
    tmplTable,
    FXMAP
) {
    'use strict';

    var tableGrowth = Handlebars.compile(tmplTable)

    var wdsClient = new WDSClient(Config.wds_config);

    function MAP(opts) {

        opts = opts || {};

        var self = this;

        self.o = _.defaults(opts, {
            isCountry: false,
            selection: {
                year: Config.rangeslider_config.defaultValues.min, //single year only for map
                year_list: _.range(
                    Config.rangeslider_config.defaultValues.min,
                    Config.rangeslider_config.defaultValues.max+1
                ).join(','),
                commodity_code: null,
                trade_flow_code:'EXP',
                partner_code: null
            },
            selectedCountries: [],
            cl: {
                indicators: null
            },
            onChangeYear: $.noop
        });

        self.map = null;
        self.joinlayer = null;
        self.slider = null;

        self.$container = (self.o.container instanceof jQuery) ? self.o.container : $(self.o.container);
        
        self.mapId = 'map_'+(self.o.isCountry?'country':'region');
        self.$container.append( Handlebars.compile(tmplMap)({mapId: self.mapId }) );

        self.initMap(self.mapId);

        if(self.o.isCountry)
            self.initComm(self.o.selection);
        else
            self.initGrowth(self.o.selection);

        var years = self.o.selection.year_list.split(',');
        self.slideCfg = {
            id: 'filter_year_map',
            tooltip: 'always',
            value: parseInt(_.first(years)),
            min: parseInt(_.first(years)),
            max: parseInt(_.last(years))
        };

        self.slider = $('#filter_year_map', self.$container).bootstrapSlider(self.slideCfg);
        self.slider.on('slideStop', function(sel) {
            self.o.onChangeYear( sel.value );
            
            self.o.selection.year = sel.value;
    
            if(!self.o.isCountry) {

                self.updateLayer(self.o.selection);
                self.initTopPartners(self.o.selection);
            }
            else
                self.initLeftPartners(self.o.selection);            
        });

        self.initYearSlider(self.o.selection);
    };

    MAP.prototype.initTopPartners = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.region_partners,
                queryVars: selection
            },
            success: function (data) {

                data = _.map(data, function(v) {
                    return v;
                });

                $('#filter_partner_code', self.$container).html( tableGrowth({
                    headers: ['Partner', selection.year+' (USD)'],
                    rows: data
                }) );
            }
        });
    };

    MAP.prototype.initLeftPartners = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.map_partner,
                queryVars: selection
            },
            success: function (data) {

                if(!data || data.length===0)
                    return;
                
                var resData = [];
                for(var i in data) {

                    if(i > Config.max_countries_list)
                        break;

                    if(data[i])
                        resData.push({
                            id: parseInt(data[i][0]),
                            text: data[i][1]
                            //,state: {selected: i<1}
                        });
                }

                if(self.jstree)
                    $('#filter_partner_code', self.$container).jstree('destroy');

                self.jstree = $('#filter_partner_code', self.$container).jstree({
                    plugins: ["wholerow", "checkbox"],
                    core: {
                        multiple: false,
                        themes: {
                            icons: false
                        },
                        data: resData
                    }
                }).on('changed.jstree', function (e, data) {
                    e.preventDefault();
                    
                    self.o.selection.partner_code = data.selected[0];

                    self.initComm(self.o.selection);

                    console.log(self.o.selection)
                    self.zoomTo([parseInt(self.o.selection.partner_code)]);
                });
            }
        });
    };

    MAP.prototype.initGrowth = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.table_region,
                queryVars: selection
            },
            success: function (data) {
                $('#tab_growth', self.$container).html( tableGrowth({
                    headers: ['Period','Growth Rate'],
                    rows: data
                }) );
            }
        });
    };

    MAP.prototype.initComm = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.map_subcommodities,
                queryVars: selection
            },
            success: function (data) {
                $('#tab_growth', self.$container).html( tableGrowth({
                    headers: ['Commodity', selection.year+' (USD)'],
                    rows: data
                }) );
            }
        });
    };    

    MAP.prototype.initYearSlider = function(selection) {

        var self = this;

        var years = selection.year_list.split(',');

        self.slideCfg = {
                id: 'filter_year_map',
                tooltip: 'always',
                value: parseInt(_.first(years)),
                min: parseInt(_.first(years)),
                max: parseInt(_.last(years))
            };

        if(self.slider) {
            self.slider.bootstrapSlider('setAttribute','min', self.slideCfg.min);
            self.slider.bootstrapSlider('setAttribute','max', self.slideCfg.max);
            self.slider.bootstrapSlider('setValue', self.slideCfg.min);
        }
        
        selection.year = self.slideCfg.value;

        self.updateLayer(selection);

        if(!self.o.isCountry)
            self.initTopPartners(selection);
        else
            self.initLeftPartners(selection);
    };

    MAP.prototype.initMap = function(id) {

        var self = this;

        this.map = new FM.Map(id, Config.map_config);

        this.map.addLayer(new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: 'Country Boundaries',
            urlWMS: 'http://fenix.fao.org/geoserver',
            opacity: 1,
            zindex: 800,
            lang: 'en'
        }));

        this.map.addLayer(new FM.layer({
            layers: 'fenix:gaul0_eco_3857',
            layertitle: 'ECO Countries',
            urlWMS: 'http://fenix.fao.org/demo/fenix/geoserver',
            opacity: 0.5,
            zindex: 1000,
            lang: 'en'
        }));

        this.map.createMap(40,0);
    };

    MAP.prototype.renderSelection = function(selection) {

        var self = this;

        self.o.selection = selection;

        if(!self.o.selection.year)
            self.o.selection.year = selection.year_list.split(',')[0];

        if(!self.o.selection.trade_flow_code)
            self.o.selection.trade_flow_code = 'EXP';        

        self.initYearSlider(self.o.selection);
        
        if(self.o.isCountry)
            self.initComm(self.o.selection);
        else
            self.initGrowth(self.o.selection);

        self.updateLayer(self.o.selection);
    };


    MAP.prototype.updateLayer = function(selection, countries) {

        var self = this;

        var id = _.uniqueId();
        self.idlayer = id;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.map_region,
                queryVars: selection
            },
            success: function(rawData) {

                if (self.idlayer == id) {

                    var joinColumnlabel = 'areanamee',
                        joinColumn = 'adm0_code',
                        joinData = _.map(rawData, function(v) {
                            if(_.isArray(countries))
                            {
                                if(_.contains(countries, parseInt(v[0])) ) 
                                    return _.object([v[0]], [v[1]]);
                            }
                            else
                                return _.object([v[0]], [v[1]]);
                        }),
                        ranges = Config.legend_config[ selection.trade_flow_code ].ranges,
                        colorramp = Config.legend_config[ selection.trade_flow_code ].colors,
                        layertitle = Config.legend_config[ selection.trade_flow_code ].title;


                    joinData = _.compact(joinData);

                    if(self.joinlayer)
                        self.map.removeLayer(self.joinlayer);

                    self.joinlayer = new FM.layer({
                        ranges: ranges,
                        joincolumnlabel: joinColumnlabel,
                        joincolumn: joinColumn,
                        joindata: joinData,
                        layers: 'fenix:gaul0_faostat_3857',
                        layertitle: layertitle,
                        opacity: 0.8,
                        mu: "US$",
                        legendsubtitle: "",
                        layertype: "JOIN",
                        jointype: "shaded",
                        openlegend: true,
                        defaultgfi: true,
                        colorramp: colorramp,
                        intervals: 7,
                        lang: "en",
                        customgfi: {
                            showpopup: true,             
                            content: {
                                en: '<h3 style="color:#666">{{areanamee}} <br> <b>{{{adm0_code}}}</b> USD</h3>'
                            }
                        }
                    });
                    self.map.addLayer(self.joinlayer);
                }
            }
        });        
    };

    MAP.prototype.zoomTo = function(codes) {
        
        var self = this;

        self.map.zoomTo("country", "adm0_code", codes);
  
        self.updateLayer(self.o.selection, codes);
/*        if(self.selLayer)
            self.map.removeLayer(self.selLayer);

        var cql_filter = "adm0_code IN (" + codes.join(",")+")";

        if(self.joinlayer)
            self.map.removeLayer(self.joinlayer);

        self.selLayer = new FM.layer({
            layertitle: "Selection",
            urlWMS: 'http://fenix.fao.org/demo/fenix/geoserver',            
            layers: 'fenix:gaul0_3857',
            cql_filter: cql_filter,
            style: 'gaul0_highlight_polygon_strong',
            opacity: 0.9,
            zindex: 2000
        });
        self.map.addLayer(self.selLayer); */       
    };

    return MAP;
});