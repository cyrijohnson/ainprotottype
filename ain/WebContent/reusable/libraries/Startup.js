jQuery.sap.declare("reusable.libraries.Startup");
( function() {
	
	// Sets all the service enums as an attribute to Utils.
	sap.ain.utils.setServiceEnums();
	
	sap.ui.getCore().setModel(new sap.ui.model.resource.ResourceModel({
        bundleUrl: "./ainResources/l10n/label.hdbtextbundle",
        bundleLocale: sap.ui.getCore().getConfiguration().getLocale().getLanguage(),
        async: true
    }), "ainI18NModel");
	
	var app = new sap.m.App({initialPage:"idEquipment1"});
	var page = sap.ui.view({id:"idEquipment1", viewName:"views.equipment.Equipment", type:sap.ui.core.mvc.ViewType.XML});
	app.addPage(page);
	app.placeAt("content");
	
	
} )();