jQuery.sap.declare("reusable.libraries.ServiceHandler");
if ( !sap ) {
	var sap = {};
}
if ( !sap.ain ) {
	sap.ain = {};
}

if ( !sap.ain.serviceHandler ) {
	sap.ain.serviceHandler = {};
}

( function( ainServiceHandler ) {
	var serviceHandler = {
			
			/**
			 * Handles all the read services.
			 * @param url
			 * @param isAsync
			 * @param success
			 * @param error
			 * @since .9
			 * @returns void
			 */
			getData: function( url, isAsync, success, error ) {
				if ( url && success && error ) {
					if ( url.constructor === String ) {
						if ( success.constructor === Function ) {
							if ( error.constructor === Function ) {
								jQuery.ajax( {
									url: url,
									async: isAsync || true,
									type: "GET",
									contentType: "json; charset=UTF-8",
									success: function( data ) {
										if ( data.constructor === Object ) {
											success( data );
										} else if ( data.constructor === String ) {
											success( JSON.parse( data ) );
										}
									},
									error: error
								} );
							} else {
								jQuery.sap.log.error( "getData failed", "callback should be a type of Function", "ServiceHandler.js" );
							}
						} else {
							jQuery.sap.log.error( "getData failed", "callback should be a type of Function", "ServiceHandler.js" );
						}
					} else {
						jQuery.sap.log.error( "getData failed", "url should be of type String", "ServiceHandler.js" );
					}
				}
			}
	};
	
	// To make the function accesible outside the closure
	ainServiceHandler.getData = serviceHandler.getData;
} )( sap.ain.serviceHandler );
