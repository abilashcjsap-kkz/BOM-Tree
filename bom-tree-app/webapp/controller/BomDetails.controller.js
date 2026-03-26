sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History",
  "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, JSONModel, History, MessageBox) {
  "use strict";

  return Controller.extend("com.example.bomtree.controller.BomDetails", {
    onInit: function () {
      var oViewModel = new JSONModel({
        headerText: "",
        filters: {}
      });
      this.getView().setModel(oViewModel, "view");
      this.getView().setModel(new JSONModel({ nodes: [] }), "tree");

      this.getOwnerComponent().getRouter().getRoute("BomDetails").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      var oFilters = {
        Matnr: decodeURIComponent(oArgs.Matnr),
        Werks: decodeURIComponent(oArgs.Werks),
        Stlal: decodeURIComponent(oArgs.Stlal),
        Stlan: decodeURIComponent(oArgs.Stlan)
      };

      this.getView().getModel("view").setProperty("/filters", oFilters);
      this.getView().getModel("view").setProperty(
        "/headerText",
        "Material: " + oFilters.Matnr + " | Plant: " + oFilters.Werks + " | Alt BOM: " + oFilters.Stlal + " | Usage: " + oFilters.Stlan
      );

      this._loadBomData(oFilters);
    },

    _loadBomData: function (oFilterValues) {
      var oModel = this.getView().getModel();
      var aFilters = [
        new Filter("Matnr", FilterOperator.EQ, oFilterValues.Matnr),
        new Filter("Werks", FilterOperator.EQ, oFilterValues.Werks),
        new Filter("Stlal", FilterOperator.EQ, oFilterValues.Stlal),
        new Filter("Stlan", FilterOperator.EQ, oFilterValues.Stlan)
      ];

      oModel.read("/treeSet", {
        filters: aFilters,
        success: function (oData) {
          var aResults = (oData && oData.results) || [];
          var aTreeNodes = this.buildTreeFromFlatData(aResults);
          this.getView().getModel("tree").setProperty("/nodes", aTreeNodes);
        }.bind(this),
        error: function (oError) {
          MessageBox.error("Failed to load BOM data.", {
            details: (oError && oError.responseText) || "No further error details available."
          });
        }
      });
    },

    buildTreeFromFlatData: function (aRows) {
      if (!aRows.length) {
        return [];
      }

      var aSorted = aRows.slice().sort(function (a, b) {
        return Number(a.Stufe) - Number(b.Stufe);
      });

      var aRoots = [];
      var aStack = [];

      aSorted.forEach(function (oRow, index) {
        var iLevel = Number(oRow.Stufe);
        var oNode = Object.assign({}, oRow, { children: [] });

        if (index === 0 || iLevel <= 0) {
          aRoots.push(oNode);
          aStack = [{ level: iLevel, node: oNode }];
          return;
        }

        while (aStack.length && aStack[aStack.length - 1].level >= iLevel) {
          aStack.pop();
        }

        var oParent = null;
        if (aStack.length) {
          oParent = aStack[aStack.length - 1].node;
        }

        if (oParent) {
          oParent.children.push(oNode);
        } else {
          aRoots.push(oNode);
        }

        aStack.push({ level: iLevel, node: oNode });
      });

      return aRoots;
    },

    onRefresh: function () {
      var oFilters = this.getView().getModel("view").getProperty("/filters");
      this._loadBomData(oFilters);
    },

    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getOwnerComponent().getRouter().navTo("Input", {}, true);
      }
    }
  });
});
