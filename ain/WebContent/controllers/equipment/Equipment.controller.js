jQuery.sap.includeStyleSheet("./ainResources/styles/Equipment.css");
jQuery.sap.require("reusable.libraries.ServiceHandler");

sap.ui.controller("controllers.equipment.Equipment", {

	/***********************************
	 * **********************************
	 * CONTROLLER LIFECYCLE METHODS STARTS
	 * **********************************
	 ***********************************/

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf ain.Equipment
	 */
	onInit: function() {
		this.initModels();
		this.initFragments();
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf ain.Equipment
	 */
	onAfterRendering: function() {
	},

	/**
	 * Initialize all the name models.
	 * @param void
	 * @returns void
	 * @since 0.9
	 */
	initModels: function() {
		var model;
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel( model, "equipmentManufacturerInformation");
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel( model, "equipmentInstallationInformation");
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel( model, "equipmentLocationInformation");
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel( model, "equipmentOverviewTimeline");
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel( model, "equipmentOverviewTiles");
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel( model, "oModel_equipmentRelatedEquipment");
		model = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(model, "oModel_equipmentRelatedPersons");
	},

	/**
	 * Invokes all the methods which initializes the fragments
	 * @param void
	 * @returns void
	 * @since 0.9
	 */
	initFragments: function() {
		this.initEquipmentInformationFragment();
		this.initEquipmentStructureFragment();
		this.initEquipmentOverview();
		this.initEquipmentRelatedFragment();
	},

	/***********************************
	 * **********************************
	 * CONTROLLER LIFECYCLE METHODS ENDS
	 * **********************************
	 ***********************************/

	/***********************************
	 * **********************************
	 * EQUIPMENT OVERVIEW BLOCK STARTS
	 * **********************************
	 ***********************************/

	initEquipmentOverview: function() {
		var that = this;

		var equipmentOverviewTiles = this.byId(sap.ui.core.Fragment.createId("equipment-overview-fragment","equipment-overview-tile-container"));
		equipmentOverviewTiles.setModel( sap.ui.getCore().getModel("equipmentOverviewTiles") );
		sap.ain.serviceHandler.getData( "./ainResources/dummyData/Data.json",  true, function( data ) {
			sap.ui.getCore().getModel("equipmentOverviewTiles").setData( data.EquipmentOverviewTiles );
		}, function( error ) {
			//Service call failed
		} );


		var equipmentOverviewTimeline = this.byId(sap.ui.core.Fragment.createId("equipment-overview-fragment", "equipment-overview-timeline"));
		equipmentOverviewTimeline.bindAggregation("content", "/Events", function(sId, oObject) {

			var layout = new sap.ui.layout.VerticalLayout();
			var image, label, link, statusLable, hLayout;
			if ( oObject.getProperty().Type === "ImageUpload" ) {
				image = new sap.m.Image( {
					src: oObject.getProperty().Url
				} );
				layout.addContent( image );
			} else if ( oObject.getProperty().Type === "Alert" ) {
				label = new sap.m.Label( {
					text: oObject.getProperty().AlertMessage
				} );
				image = new sap.m.Image( {
					src: oObject.getProperty().Url
				} );
				link = new sap.m.Link( {
					text: oObject.getProperty().LinkText
				} );
				layout.addContent( label ).addContent( image ).addContent( link );
			} else if ( oObject.getProperty().Type === "Chat" ) {
				label = new sap.m.Link( {
					text: oObject.getProperty().Text
				} );
				layout.addContent( label );
			} else if ( oObject.getProperty().Type === "Broadcast" ) {
				link = new sap.m.Link( {
					text: oObject.getProperty().LinkText
				} );
				label = new sap.m.Label( {
					text: oObject.getProperty().Text,
					width: "220px"
				} );
				statusLabel = new sap.m.Label( {
					text: oObject.getProperty().Status
				} );
				layout.addContent( link ).addContent( label ).addContent( statusLabel );
			} else if (  oObject.getProperty().Type === "FileUpload"  ) {
				hLayout = new sap.ui.layout.HorizontalLayout( {
					content: [ new sap.ui.core.Icon( { src: "sap-icon://pdf-attachment", size: "40px" } ), new sap.m.Link( { text: oObject.getProperty().FileName } ) ]
				} );
				layout.addContent( hLayout );
			}

			return new sap.suite.ui.commons.TimelineItem({
				userName: oObject.getProperty().CustomerID,
				title: oObject.getProperty().CustomerName,
				icon: oObject.getProperty().Icon,
				text: oObject.getProperty().ProductName,
				dateTime: oObject.getProperty().OrderDate,
				embeddedControl: layout
			});
		});

		equipmentOverviewTimeline.setModel( sap.ui.getCore().getModel("equipmentOverviewTimeline") );
		sap.ain.serviceHandler.getData( "./ainResources/dummyData/Data.json",  true, function( data ) {
			sap.ui.getCore().getModel("equipmentOverviewTimeline").setData( data.EquipmentOverviewTimeline );
			that.byId(sap.ui.core.Fragment.createId("equipment-overview-fragment", "equipment-overview-timeline-event-count")).setText( "Events (" + data.EquipmentOverviewTimeline.Events.length + ")" );
		}, function( error ) {
			//Service call failed
		} );
	},

	/***********************************
	 * **********************************
	 * EQUIPMENT OVERVIEW BLOCK ENDS
	 * **********************************
	 ***********************************/

	/***********************************
	 * **********************************
	 * EQUIPMENT INFORMATION BLOCK STARTS
	 * **********************************
	 ***********************************/

	/**
	 * Instantiates the views and add the views as contents of the object header
	 * @param void
	 * @returns void
	 * @since 0.9
	 */
	initEquipmentInformationFragment: function( data ) {
		var that = this;

		var equipmentManufacturerInformation = this.byId(sap.ui.core.Fragment.createId("equipment-information-fragment", "equipment-manufacturer-information-sub-section"));
		equipmentManufacturerInformation.setModel( sap.ui.getCore().getModel("equipmentManufacturerInformation") );
		sap.ain.serviceHandler.getData( "./ainResources/dummyData/Data.json",  true, function( data ) {
			sap.ui.getCore().getModel("equipmentManufacturerInformation").setData( data.ManufacturerInformation );
		}, function( error ) {
			//Service call failed
		} );

		var equipmentInstallationInformation = this.byId(sap.ui.core.Fragment.createId("equipment-information-fragment", "equipment-installation-information-sub-section"));
		equipmentInstallationInformation.setModel( sap.ui.getCore().getModel("equipmentInstallationInformation") );
		sap.ain.serviceHandler.getData( "./ainResources/dummyData/Data.json",  true, function( data ) {
			sap.ui.getCore().getModel("equipmentInstallationInformation").setData( data.InstallationInformation );
		}, function( error ) {
			//Service call failed
		} );

		var equipmentLocationInformation = this.byId(sap.ui.core.Fragment.createId("equipment-information-fragment", "equipment-location-map"));
		sap.ain.serviceHandler.getData( "./config/MapsModelConfiguration.json",  true, function( data ) {
			sap.ui.getCore().getModel("equipmentLocationInformation").setData( data );
			equipmentLocationInformation.bindProperty("config", "equipmentLocationInformation>/");
			equipmentLocationInformation.setModel( sap.ui.getCore().getModel("equipmentLocationInformation") );

			var oIncidentFlagSkeleton = {
					"SAPVB": {
						"version": "2.0",
						"Data": {
							"Set": {
								"type": "N",
								"name": "IncidentFlags",
								"N": {
									"name": "IncidentFlags",
									"E": []
								}
							}
						}
					}
			};

			var oFlagData = {};
			oFlagData["position"] = "77.714421;12.977788;0.0";
			oFlagData["tooltip"] = "";
			oFlagData["key"] = "1";
			oFlagData["description"] = "location";
			oFlagData["VB:m"] = "true";
			oFlagData["VB:c"] = "false";

			oFlagData["image"] = "alert_red.png";

			oIncidentFlagSkeleton.SAPVB.Data.Set.N.E.push(oFlagData);
			equipmentLocationInformation.load(oIncidentFlagSkeleton);

			equipmentLocationInformation.zoomToGeoPosition( 77.714421, 12.977788, 12);

		}, function( error ) {
			//Service call failed
		} );
	},

	/***********************************
	 * **********************************
	 * EQUIPMENT INFORMATION BLOCK ENDS
	 * **********************************
	 ***********************************/

	/***********************************
	 * **********************************
	 * EQUIPMENT STRUCTURE BLOCK STARTS
	 * **********************************
	 ***********************************/

	/**
	 * Initialize the equipment structure fragment.
	 * @param void
	 * @returns void
	 * @since .9
	 */
	initEquipmentStructureFragment: function(file) {
		this.equipmentStructureFragment = this.byId(sap.ui.core.Fragment.createId("equipment-structure-fragment", "equipment-structure-component-list"));
		this.equipmentStructureFragmentModel = new sap.ui.model.json.JSONModel();
		this.equipmentStructureFragment.setModel( this.equipmentStructureFragmentModel );
	},

	fnHandleSelectOfNodeDetailsList: function(oEvent) {
		var oBoundObj = oEvent.getParameters().listItem.getBindingContext().getProperty();
		this.oDvl.Scene.ChangeNodeFlags(this.oDvl.Settings.LastLoadedSceneId, this.oDvl.Settings.LastLoadedNodeId, 
				DvlEnums.DVLNODEFLAG.DVLNODEFLAG_SELECTED, 
				DvlEnums.DVLFLAGOPERATION.DVLFLAGOP_CLEAR);
		this.oDvl.Scene.ChangeNodeFlags(this.oDvl.Settings.LastLoadedSceneId, oBoundObj[ "id" ], DvlEnums.DVLNODEFLAG.DVLNODEFLAG_SELECTED, DvlEnums.DVLFLAGOPERATION.DVLFLAGOP_SET);
		this.oDvl.Settings.LastLoadedNodeId = oBoundObj[ "id" ];


	},

	fnHandleSelectOfNode: function( nodeId ) {
		var modelData = this.equipmentStructureFragmentModel.getData();
		var nodeDetails = modelData[ "nodeDetails" ];
		for ( var i = 0; i < nodeDetails.length; i++ ) {
			if ( nodeDetails[ i ][ "id"] === nodeId ) {
				nodeDetails[ i ][ "bIsSelected" ] = true;
			} else {
				nodeDetails[ i ][ "bIsSelected" ] = false;
			}
		}
		modelData[ "nodeDetails" ] = nodeDetails;
		this.equipmentStructureFragmentModel.setData( modelData );
	},

	/**
	 * This function is triggered when you select a file through the file input control
	 * @param event
	 * @returns void
	 * @since .9
	 */
	onChange: function( event ) {
		var that = this;
		var file = event.getParameter("files")["0"];
		this.oDvl = Dvl.Create("equipment-canvas", true, {configureCanvas: true});
		this.track = new sap.ve.Loco(this.oDvl, this.oDvl.canvas, true);

		this.oDvl.Helpers.LoadLocalFile(file, null, function (fileToken, pwd) {
			var currentSceneId = that.oDvl.Settings.LastLoadedSceneAttempt = that.oDvl.Core.LoadScene(fileToken, pwd);
			if (currentSceneId.substring(0, 1) == "e") {
				throw (currentSceneId);
			}
			else {
				that.track.is2d = false;
				that.oDvl.Renderer.AttachScene(currentSceneId);
				that.oDvl.Scene.Release(currentSceneId);
				that.oDvl.Settings.LastLoadedSceneId = currentSceneId;
				that.oDvl.Helpers.Refresh();
			}

			var nodeInfo = that.getAllNodes( that.oDvl );
			that.equipmentStructureFragmentModel.setData( nodeInfo );

		}, null, null);

//		var url = "./ainResources/dummyData/PocketKnife.vds";
//		this.oDvl.Helpers.LoadFile(url, null, function (fileToken, pwd) {
//		var currentSceneId = that.oDvl.Settings.LastLoadedSceneAttempt = that.oDvl.Core.LoadScene(fileToken, pwd);
//		if (currentSceneId.substring(0, 1) == "e") {
//		throw (currentSceneId);
//		}
//		else {
//		that.track.is2d = false;
//		that.oDvl.Renderer.AttachScene(currentSceneId);
//		that.oDvl.Scene.Release(currentSceneId);
//		that.oDvl.Settings.LastLoadedSceneId = currentSceneId;
//		that.oDvl.Helpers.Refresh();           
//		}

//		var nodeInfo = that.getAllNodes( that.oDvl );
//		that.equipmentStructureFragmentModel.setData( nodeInfo );
//		}, null, null);


		this.oDvl.Client.OnNodeSelectionChanged = function (clientId, sceneId, numberOfSelectedNodes, idFirstSelectedNode) {
			if (numberOfSelectedNodes > 0) {
				that.fnHandleSelectOfNode( idFirstSelectedNode );
				that.track.lastSelectedNodeId = idFirstSelectedNode;
			} else {
				that.track.lastSelectedNodeId = null;
			}  
		};


	},

	getAllNodes: function( oDvl ) {
		var dvlInfo = {};
		dvlInfo.nodeDetails = [];
		var node;
		var nodes = this.oDvl.Scene.FindNodes(oDvl.Settings.LastLoadedSceneId, 2).nodes;

		for ( var i = 0; i < nodes.length; i++ ) {
			node = this.oDvl.Scene.RetrieveNodeInfo( oDvl.Settings.LastLoadedSceneId, nodes[ i ], 3 );
			node[ "id" ] = nodes[ i ];
			node[ "bIsSelected" ] = true;
			dvlInfo.nodeDetails.push( node );
		}

		return dvlInfo;
	},

	/***********************************
	 * **********************************
	 * EQUIPMENT STRUCTURE BLOCK ENDS
	 * **********************************
	 ***********************************/
	
	/***********************************
	 * **********************************
	 * EQUIPMENT RELATED BLOCK STARTS
	 * **********************************
	 ***********************************/
	
	
	initEquipmentRelatedFragment: function(data){
		var that = this;
		var equipmentRelatedEquipment = this.byId(sap.ui.core.Fragment.createId("equipment-related-fragment", "equipment-related-equipment-sub-section"));
		equipmentRelatedEquipment.setModel( sap.ui.getCore().getModel("oModel_equipmentRelatedEquipment") );
		sap.ain.serviceHandler.getData( "./ainResources/dummyData/Data.json",  true, function( data ) {
			sap.ui.getCore().getModel("oModel_equipmentRelatedEquipment").setData( data.EquipmentRelatedEquipment );
		}, function( error ) {
			//Service call failed
		} );
		
		var equipmentRelatedPersons = this.byId(sap.ui.core.Fragment.createId("equipment-related-fragment", "equipment-related-persons-sub-section"));
		equipmentRelatedPersons.setModel( sap.ui.getCore().getModel("oModel_equipmentRelatedPersons") );
		sap.ain.serviceHandler.getData( "./ainResources/dummyData/Data.json",  true, function( data ) {
			sap.ui.getCore().getModel("oModel_equipmentRelatedPersons").setData( data );
		}, function( error ) {
			//Service call failed
		} );

	}
	
	/***********************************
	 * **********************************
	 * EQUIPMENT RELATED BLOCK ENDS
	 * **********************************
	 ***********************************/

});