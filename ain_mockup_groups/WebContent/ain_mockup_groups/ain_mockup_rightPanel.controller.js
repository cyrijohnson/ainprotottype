sap.ui.controller("ain_mockup_groups.ain_mockup_rightPanel", {

	onInit: function() {
		
		this.currentGroupId = "ixj9CY4panSfomoNQGDa3n";
		this.bindDataToGroupCreation();
		this.getMyCollaborationsData();
	},

	bindDataToGroupCreation : function(){
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
	
	onPressOpenAddParticipantDialog : function(oEvent){
		if(this.addParticipantsDialog == undefined){
			this.addParticipantsDialog = sap.ui.xmlfragment("addParticipantDialog","fragments.addParticipantDialog",this);
			this.getView().addDependent(this.addParticipantsDialog);
		}
		
		this.addParticipantsDialog.open();
	},
	
	createGroup : function(){
		var groupName = this.byId("groupName").getValue();
		var groupDescription = this.byId("groupDescription").getValue();
		var groupType = this.byId("securityLevelActionSelect").getSelectedKey();
		
		var GroupJson = {};
		GroupJson.Name = groupName;
		GroupJson.Description = groupDescription;
		GroupJson.GroupType = groupType;
		
		sap.ui.getCore().getModel("oModel_ain_ldcier3").create('/Groups',GroupJson, null, function(oData){
			alert("Create successful");
			this.groupId = oData.Id;
		},function(oError){
			alert("Create failed");});
	},
	
	onPressShowAllGroups : function(oEvent){
		sap.ui.getCore().getModel("oModel_ain_ldcier3").read('/Groups', null, null, true, function(oData, oResponse){
			this.groupsJSON ={
					groups :oData.results
			}
			if(this.groupsModel === undefined){
				this.groupsModel = new sap.ui.model.json.JSONModel();
			}
		
			this.groupsModel.setData(this.groupsJSON);
			this.groupsModel.checkUpdate();
	 		
			if(this.allGroupsDialog == undefined){
				this.allGroupsDialog = sap.ui.xmlfragment("allGroupsDialog","fragments.allGroupsDialog",this);
			}
			this.allGroupsDialog.setModel(this.groupsModel);
			this.getView().addDependent(this.allGroupsDialog);
			
			this.allGroupsDialog.open();
	 	},function(){
			alert("Read failed");});
	
	},
	
	onPressHandleClose : function(oEvent){
		oEvent.getSource().getParent().close();
	},
	
	onPressAddParticipantToParticipantList : function(oEvent){
		var memberName = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("addParticipantDialog","memberName")).getValue();
		var memberEmailId = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("addParticipantDialog","memberEmailId")).getValue();
		
		var memberDetails = {};
		memberDetails.memberName = memberName;
		memberDetails.memberEmailId = memberEmailId;
		
		var memberDetailsStandardListItem = new sap.m.StandardListItem({
			title : memberName,
			description : memberEmailId
		});
		
		this.byId("participantsList").addItem(memberDetailsStandardListItem);
		this.addParticipantsDialog.close();
	},
	
	onPressCreateGroupAndAddMembers : function(oEvent){
		this.createGroup();
		this.addMembersToGroup();
	},
	
	addMembersToGroup : function(){
		var membersList = [];
		membersList = this.byId("participantsList").getItems();
		for(var index = 0; index < membersList.length; index++){
			var inviteMemberObject = {};
			inviteMemberObject.Name = membersList[index].getTitle();
			inviteMemberObject.Email = membersList[index].getDescription();
			var invite_member_path = "/Group_Invite?Id='"+this.groupId+"'&Email='"+inviteMemberObject.Email+"'&Message='Please join this group'";
			sap.ui.getCore().getModel("oModel_ain_ldcier3").create(invite_member_path, inviteMemberObject, null, function(oData){
	   	     alert("Successfuly Invited");
	    	   },function(oError){
	    	    alert("Invite failed");});
		}
	},
	
	getMyCollaborationsData : function(){
		var taskpath = "/Groups('"+this.currentGroupId+"')/Tasks";
		var oController = this.getView().getController();
		sap.ui.getCore().getModel("oModel_ain_ldcier3").read(taskpath, null, null, true, function(oData, oResponse){ 
			oController.taskIdData = oData.results;
		//	this.getTaskDescriptionsAndBindDataToMyCollaborations();
			oController.getTaskDescriptionsAndBindDataToCollaborations();
		 },function(){ 
	              alert("tasks failed");
	  });
	},
	
	//to be removed since binding of my collaborations and other collaborations
	//will be done in getTaskDescriptionsAndBindDataToMyCollaborations(); function
	
	/*getTaskDescriptionsAndBindDataToMyCollaborations : function(){
		if(this.taskIdData!= undefined && this.taskIdData.length > 0){
			var oController = this.getView().getController();
			oController.taskList = [];
			var listOfTasks;
			for(var index = 0; index < this.taskIdData.length; index++){
				var taskDescriptionPath = "/Tasks('"+this.taskIdData[index].Id+"')";
				sap.ui.getCore().getModel("oModel_ain_ldcier3").read(taskDescriptionPath, null, null, false, function(oData, oResponse){ 
					var taskObject = {};
					taskObject.taskName = oData.Title;
					taskObject.taskDescription = oData.Description;
					taskObject.taskPriority = oData.Priority;
					oController.taskList.push(taskObject);
				 },function(){ 
			              alert("tasks failed");
			  });
			}
			if(oModel_taskList == undefined){
				var oModel_taskList = new sap.ui.model.json.JSONModel();
			}
			oModel_taskList.setData({listOfTasks : this.taskList});
			this.byId("myCollaborationsList").setModel(oModel_taskList);
			
		}
	},
*/	
	getTaskDescriptionsAndBindDataToCollaborations : function(){
		var oController = this.getView().getController();
		sap.ui.getCore().getModel("oModel_ain_ldcier3").read('/Self', null, null, false, function(oData, oResponse){
			oController.currentUserId = oData.Id;
		},function(){
			alert("Read failed");});
		
		if(this.taskIdData != undefined && this.taskIdData.length > 0){
			oController.myCollaborationsList = [];
			oController.myCollaborationsListTemp = [];
			oController.otherCollaborationsList = [];
			var listOfMyCollaborations;
			var listOfOtherCollaborations;
			for(var index = 0; index < oController.taskIdData.length; index++){
				var taskAssignmentPath = "/Tasks('"+oController.taskIdData[index].Id+"')/Assignments";
				sap.ui.getCore().getModel("oModel_ain_ldcier3").read(taskAssignmentPath, null, null, false, function(oData, oResponse){ 

					var myCollaborationsListFlag = true;
					
					if(oData.results.length == 0){
						return;
					}
					
					for(var i = 0; i < oData.results.length; i++){
						var otherCollaborationsListTemp = [];
						var taskAssignmentObject = {};
						taskAssignmentObject.taskId = oData.results[i].TaskId;
						taskAssignmentObject.taskName = oController.taskIdData[index].Title;
						taskAssignmentObject.taskDescription = oController.taskIdData[index].Description;
						taskAssignmentObject.status = oData.results[i].Status;
						taskAssignmentObject.priority = oController.taskIdData[index].Priority;
						myCollaborationsListFlag = false;
							if(oData.results[i].AssigneeId == oController.currentUserId || oData.results[i].AssignerId == oController.currentUserId){
								oController.myCollaborationsList.push(taskAssignmentObject);
								myCollaborationsListFlag = true;
								break; // removed to loop through completely irrespective of the record already put in mycollaborations.
							}
							else{
								otherCollaborationsListTemp.push(taskAssignmentObject);
							}
					}
					
					/* code for comparing myCollaborationsList and otherCollaborationsList and removing elements with common task Id from otherCollaborationsList
					irrespective of task status.*/
					
				/*	for(var i = 0; i < this.myCollaborationsList.length; i++){
						for(var j = 0; j < this.otherCollaborationsList.length; j++ ){
							if(this.myCollaborationsList[i].taskId == this.otherCollaborationsList[j].taskId){
								this.otherCollaborationsList.splice(j,1);
							}
						}
					}*/
					
					if(!myCollaborationsListFlag){
						var otherCollaborationsObject = otherCollaborationsListTemp[0];
						oController.otherCollaborationsList.push(otherCollaborationsObject);
					}
				 },function(){ 
			              alert("tasks failed");
			  });
			}
			if(oModel_myCollaborationsList == undefined){
				var oModel_myCollaborationsList = new sap.ui.model.json.JSONModel();
			}
			
			oModel_myCollaborationsList.setData({listOfMyCollaborations : this.myCollaborationsList});
			this.byId("myCollaborationsList").setModel(oModel_myCollaborationsList);
			
			if(oModel_otherCollaborationsList == undefined){
				var oModel_otherCollaborationsList = new sap.ui.model.json.JSONModel();
			}
			
			oModel_otherCollaborationsList.setData({listOfOtherCollaborations : this.otherCollaborationsList});
			this.byId("otherCollaborationsList").setModel(oModel_otherCollaborationsList);
		}
	},
	
	checkStatus : function(status){
		if(status == "open"){
			return "Error";
		}
		else if(status == "completed"){
			return "Success";
		}
		else if(status == "in_progress"){
			return "None";
		}
	},
	
	openNewCollaborations : function(){
			var newCollaborationView = sap.ui.view({
				viewName : "ain_mockup_groups.newCollaborations",
				type : sap.ui.core.mvc.ViewType.XML,
				width : "100%"
			});
			
			this.byId("ain_right_section").removeAllContent();
			this.byId("ain_right_section").addContent(newCollaborationView);
	},
	

	openTaskPanel : function(){
		var addTaskPanelView = sap.ui.view({
			viewName : "ain_mockup_groups.addTaskPanel",
			type : sap.ui.core.mvc.ViewType.XML,
			width : "100%"
		});
		this.byId("ain_right_section").removeAllContent();
		this.byId("ain_right_section").addContent(addTaskPanelView);
	},
	
	onPressGoToNewView : function(oEvent){
		if(this.currentGroupId == undefined){
			this.openNewCollaborations();
		}
		else{
			this.openTaskPanel();
		}
	},
	
	showOrHideJamCurtain : function(oEvent){
		if(this.byId("ain_right_section").getLayoutData()){
			if(this.byId("ain_right_section").getLayoutData().getSize() === "auto"){
				this.byId("ain_objectPageLayout").getLayoutData().setSize("100%");
				this.byId("ain_right_section").getLayoutData().setSize("0%");
			}else{
				this.byId("ain_objectPageLayout").getLayoutData().setSize("80%");
				this.byId("ain_right_section").getLayoutData().setSize("auto");
			}
		}
	},
	
	onExit: function() {
		if(this.addParticipantsDialog != undefined){
			this.addParticipantsDialog.destroy();
		}
	}

});