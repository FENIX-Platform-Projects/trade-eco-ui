define({
	wds_config: {
        datasource: 'DEMO_FENIX',
		outputType: 'array'
	},
	queries: {
		test: 'SELECT year FROM ecotrade_region_trade',
//    "from country_stat where fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c  join codes_elements on element = element_code WHERE value is not null ORDER BY element ASC, year ASC"
		// REGIONS QUERIES
		table_region : "select year, value from ecotrade.ecotrade_region_growth where year in ({year_list}) and commodity_code = '{commodity_code}}' and trade_flow_code = '{trade_flow_code}'",
		map_region :   "select partner_code, value from ecotrade.ecotrade_region_trade where commodity_code ='{commodity_code}}' and trade_flow_code ='{trade_flow_code}' and year = '{year}'",
		region_within:  "select year,partner_label,value,um from ecotrade.ecotrade_region_trade where year in ({year_list}) and partner_code in ('WTO', 'WTN') and  trade_flow_code = '{trade_flow_code}' and commodity_code ='{commodity_code}'",
		region_year : "select year,trade_flow_label,value,um from ecotrade.ecotrade_region_trade where year in ({year_list}) and partner_code = '{partner_code}' and commodity_code = '{commodity_code}'",

		// COUNTRY QUERIES

		// reporter o partner?
		country_balance: "select year,commodity_label,value,um from ecotrade.ecotrade_country_tradebalance where year in ({year_list}) and partner_code = '{partner_code}' and commodity_code = '{commodity_code}'",
		country_bar : "select year,partner_label, value, um from ecotrade.ecotrade_country_trade where year in ({year_list}) and partner_code = '{partner_code}' and commodity_code = '{commodity_code}'",
		map : "select * from ecotrade.ecotrade_country_trade where year = {year} and partner_code = '{partner_code}' and commodity_code = '{commodity_code}' and trade_flow_code = '{trade_flow_code}' "

	}
});