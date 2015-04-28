sap.ui.controller("ain_mockup_groups.newCollaborations", {

	
	onInit: function() {
		this.bindDataToCollaboration();
	},
	
	bindDataToCollaboration : function(){
		this.collaborationPage_securityLevel = [];
		var securityLevelNames = [{level_key:"public_internal",level_name:"public"},{level_key:"private_internal",level_name:"private"},{level_key:"private_external",level_name:"external"}];
		var securityLevelData;

		for(var index = 0; index < securityLevelNames.length; index++){
			var security_Levels = {};
			security_Levels.levelKey = securityLevelNames[index].level_key;
			security_Levels.levelName = securityLevelNames[index].level_name;
			this.collaborationPage_securityLevel.push(security_Levels);
		}
		var oModel_collaborationPage = new sap.ui.model.json.JSONModel();
		oModel_collaborationPage.setData({securityLevelData : this.collaborationPage_securityLevel});
		this.byId("securityLevelActionSelect").setModel(oModel_collaborationPage);
	},

	onExit: function() {

	}

});