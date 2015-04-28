function setModelToCore(){
	var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
	sap.ui.getCore().setModel(oModel,"oModel_ain_ldcier3");
}