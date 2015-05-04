sap.ui.controller("ain_mockup_groups.addTaskPanel", {


	onInit: function() {
		this.currentGroupId = "ixj9CY4panSfomoNQGDa3n";
		this.createtaskIconTabBarContent();
		this.buildTimeline();
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
		
		sap.ui.getCore().byId(sap.ui.core.Fragment.createId("createTaskDialog","iconTabBarCreatetaskOptions")).removeAllContent();
		
		var iconTabBarContent = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("createTaskDialog","iconTabBarCreatetaskOptions"));
		if(selectedKey == "addAssignee"){
			iconTabBarContent.addContent(oController.addAssigneeContentTemplate);
		}
		else if(selectedKey == "person"){
		}
		else if(selectedKey == "attachment"){
			
		}
		else if(selectedKey == "tree"){
	
		}
		else if(selectedKey == "edit"){
			
		}
	},
	createtaskIconTabBarContent : function(){
		var oController = this.getView().getController();
		var addAssigneeAssignmentLabel = new sap.m.Label({text:"Assignment"});
		var addAssigneeInput = new sap.m.MultiInput({type  : "Text",
														id : "assigneeName",
														showSuggestion : true,
														showValueHelp : true,
														valueHelpRequest : function(oEvent){
															oController.handleValueHelpRequest(oEvent);
														},
														placeholder : "Add Assignee"});
		var addAssigneeDueDateLabel = new sap.m.Label({text : "Due Date"});
		var addAssigneeDueDateInput = new sap.m.DateTimeInput({type  : "Date",
			id : "dueDate"});
		oController.addAssigneeContentTemplate = new sap.ui.layout.VerticalLayout({width : "100%",
			content : [addAssigneeAssignmentLabel,addAssigneeInput,addAssigneeDueDateLabel,addAssigneeDueDateInput]
		});
	},
	
	buildTimeline : function(){
		var oController = this.getView().getController();
		var feedEntriespath = "/Groups('"+this.currentGroupId+"')/FeedEntries";
		
		sap.ui.getCore().getModel("oModel_ain_ldcier3").read(feedEntriespath, null, null, true, function(oData, oResponse){ 
			console.log(oData);
	   			oController.feedEntriesJSON ={
	   					feedEntries :oData.results
	   			}
	   			
	   			if(oController.feedEntriesModel === undefined){
	   				oController.feedEntriesModel = new sap.ui.model.json.JSONModel();
	   			}
	   		
	   			oController.feedEntriesModel.setData(oController.feedEntriesJSON);
	   			oController.feedEntriesModel.checkUpdate();
	   	 		
	   			oController.byId("addTaskPanelTimeline").setModel(oController.feedEntriesModel);
	   			
	         },function(){ 
	              alert("Read feed entries failed");
	         });
	},
	
	formatCreatedAtTimeStamp : function(dateTime){
		return dateTime.getTime();
	},
	
	handleValueHelpRequest : function(oEvent){
		this._inputFieldForWhichValueHelpRequested = oEvent.getSource();
		this.getMemberIds(oEvent);
		
	},
	
	getMemberIds : function(oEvent){
		var oController = this.getView().getController();
		var groupMembersPath = "/Groups('"+this.currentGroupId+"')/Memberships"; 
		sap.ui.getCore().getModel("oModel_ain_ldcier3").read(groupMembersPath, null, null, true, function(oData, oResponse){ 
	        	oController.membersData = oData.results;
	        	oController.getListOfMembers();
	         },function(){ 
	              alert("Read failed");
	         });
	},
	
	getListOfMembers : function(){
		var oController = this.getView().getController();
		var groupMembersModel;
		var groupMembersList = [];
		oController.membersList = [];
	  	if(oController.membersData!= undefined && oController.membersData.length > 0){
	  		var listOfMembers;
			for(var index = 0; index < oController.membersData.length; index++){
				 var memberDetailsPath = "/Members('"+oController.membersData[index].MemberId+"')";
				 sap.ui.getCore().getModel("oModel_ain_ldcier3").read(memberDetailsPath, null, null, false, function(oData, oResponse){ 
					 var memberObject = {};
					 memberObject.fullName = oData.FullName;
					 memberObject.email = oData.Email;
					 oController.membersList.push(memberObject);
				 },
				 function(){ 
			              alert("Read members failed");
			     });
			}
			 
			if(oController.membersListModel === undefined){
				oController.membersListModel = new sap.ui.model.json.JSONModel();
			}
	
		oController.membersListModel.setData({listOfMembers : oController.membersList});
			oController.membersListModel.checkUpdate();
			
			if(oController.listOfMembersDialog == undefined){
   				oController.listOfMembersDialog = sap.ui.xmlfragment("listOfMembersDialog","fragments.listOfMembersDialog",oController);
   				oController.getView().addDependent(oController.listOfMembersDialog);
   				oController.listOfMembersDialog.setModel(oController.membersListModel);
   				oController.listOfMembersDialog.attachSearch(oController.memberSearch,this);
   				oController.listOfMembersDialog.attachLiveChange(oController.memberSearch,this);
   			}
   			oController.listOfMembersDialog.open();
	}

	},
	
	handleSelect : function(oEvent){
		var oController = this.getView().getController();
		var oSource = oEvent.getParameter("selectedItems");
		var sEmail;
		for(var i = 0; i < oSource.length; i++){
			sEmail = oSource[i].getBindingContext().getProperty("email");
		}
		if(oController._inputFieldForWhichValueHelpRequested != undefined){
			oController._inputFieldForWhichValueHelpRequested.getModel().getData().medicinePotency = sUom;
			oController._inputFieldForWhichValueHelpRequested.getModel().checkUpdate();
		}
	
	},
	
	memberSearch : function(oEvent){
		var properties = [];
		properties.push("fullName");
		reusable.utils.memberSearch(oEvent.getSource()._oSearchField,oEvent.getParameter("value"),this.listOfMembersDialog.getModel(),this.listOfMembersDialog.getBinding("items"),properties);

	},
	
	onExit: function() {
		if(this.createTaskDialog != undefined){
			this.createTaskDialog.destroy();
		}
	}

});