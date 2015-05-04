jQuery.sap.declare("reusable.utils");
reusable.utils = function(){
	return {
		memberSearch : function(oSearchField,val,model,binding,properties){
			reusable.utils.fuzzySearch(this,model,val,
					binding,oSearchField,properties,[]);
		},
		
		fuzzySearch : function(controller, jsonModel, sValue, oBinding, sEvent, propOfModel, prevFilters, andModelOnPrevFilters){
			sValue = sValue.trim();
			var newFilters = [];
			if(jsonModel != undefined && propOfModel != undefined && oBinding != undefined){
				for(i in propOfModel){
					var tFilter = new sap.ui.model.Filter(propOfModel[i], sap.ui.model.FilterOperator.Contains, sValue);
					newFilters.push(tFilter);
				}
				
				var orOfNewFilter = new sap.ui.model.Filter({ filters: newFilters, and: false});
				
				if(prevFilters != undefined && prevFilters.length > 0){
					var andMode = (andModeOnPrevFilters == undefined)?false:andModeOnPrevFilters;
					var orOfPrevFilter = new sap.ui.model.Filter({ filters: prevFilters, and: andMode});
					  var andOfPrevNewFilter = new sap.ui.model.Filter({ filters:[orOfNewFilter, orOfPrevFilter], and: true});
					  oBinding.filter([andOfPrevNewFilter]);
				}
				else{
					oBinding.filter([orOfNewFilter]);
				}
			}
			
		}
	};
}();