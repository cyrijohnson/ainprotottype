sap.ui.controller("ain_mockup_groups.addTaskPanel", {


	onInit: function() {
		this.createtaskIconTabBarContent();
	},
	
	onPressOpenCreateTaskDialog : function(oEvent){
		if(this.createTaskDialog == undefined){
			this.createTaskDialog = sap.ui.xmlfragment("createTaskDialog","fragments.createTaskDialog",this);
			this.getView().addDependent(this.createTaskDialog);
		}
		
		this.addTaskPriorityLevel = [];
		var priorityLevelsNames = [{level_key:"low",level_name:"Low"},{level_key:"medium",level_name:"Medium"},{level_key:"high",level_name:"High"}];
		var priorityLevelData;

		for(var index = 0; index < priorityLevelsNames.length; index++){
			var priorityLevels = {};
			priorityLevels.levelKey = priorityLevelsNames[index].level_key;
			priorityLevels.levelName = priorityLevelsNames[index].level_name;
			this.addTaskPriorityLevel.push(priorityLevels);
		}
		var oModel_priorityLevelOptions = new sap.ui.model.json.JSONModel();
		oModel_priorityLevelOptions.setData({priorityLevelData : this.addTaskPriorityLevel});
		sap.ui.getCore().byId(sap.ui.core.Fragment.createId("createTaskDialog","typeOfTaskActionSelect")).setModel(oModel_priorityLevelOptions);
		
		this.createTaskDialog.open();
	},
	
	onPressHandleClose : function(oEvent){
		oEvent.getSource().getParent().close();
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oController = this.getView().getController();
		var selectedKey = oEvent.getParameter("selectedKey");
		var verticalLayoutContent = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("createTaskDialog","iconTabBarContent"));
		if(selectedKey == "addAssignee"){
			verticalLayoutContent.setContent(oController.addAssigneeAssignmentLabel,oController.addAssigneeInput,oController.addAssigneeDueDateLabel,oController.addAssigneeDueDateInput);
		}
	},
	createtaskIconTabBarContent : function(){
		var oController = this.getView().getController();
		oController.addAssigneeAssignmentLabel = new sap.m.Label({text:"Assignment"});
		oController.addAssigneeInput = new sap.m.Input({type  : "Text",
														id : "assigneeName",
														placeholder : "Add Assignee"});
		oController.addAssigneeDueDateLabel = new sap.m.Label({text : "Due Date"});
		oController.addAssigneeDueDateInput = new sap.m.DateTimeInput({type  : "DateTime",
			id : "dueDate"});
	},
	
	
	onExit: function() {

	}

});