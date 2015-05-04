jQuery.sap.declare("reusable.libraries.Utils");
if ( !sap ) {
	var sap = {};
}
if ( !sap.ain ) {
	sap.ain = {};
}

if ( !sap.ain.utils ) {
	sap.ain.utils = {};
}

( function( ainUtils ) {
	var Utils = {

			/**
			 * Initialize the Utils variables
			 * @param void
			 * @returns void
			 * @since .9
			 */
			init: function() {
				this.serviceEnum = null;
			},
			/**
			 * Handles all the read services.
			 * @param key
			 * @since .9
			 * @returns void
			 */
			getServiceEnum: function( key ) {
				if ( this.serviceEnum ) {
					if ( this.serviceEnum[ key ] ) {
						return this.serviceEnum[ key ];
					} else {
						jQuery.sap.log.error( "getServiceEnum failed", "enum doesnt exist", "Utils.js" ); 
					}
				} else {
					jQuery.sap.log.error( "getServiceEnum failed", "enums doesnt exist", "Utils.js" );
				}
			},

			/**
			 * Sets the enums json as an attribute of Utils
			 * @param void
			 * @returns void
			 * @since 0.9
			 */
			setServiceEnums: function() {
				var that = this;
				jQuery.ajax( {
					url: "./config/Services.json",
					async: false,
					type: "GET",
					contentType: "json; charset=UTF-8",
					success: function( data ) {
						if ( data.constructure === Object ) {
							that.serviceEnum = data;
						} else if ( data.constructor === String ) {
							that.serviceEnum = JSON.parse( data );
						}
					},
					error: function() {
						jQuery.sap.log.error( "setServiceEnums failed", "service call failed", "Utils.js" );
					}
				});
			},


	};
	Utils.init();
	// To make the function accesible outside the closure
	ainUtils.setServiceEnums = Utils.setServiceEnums;
	ainUtils.getServiceEnum = Utils.getServiceEnum;
	
} )( sap.ain.utils );
