sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("com.example.bomtree.controller.Input", {
    onInit: function () {
      var oViewModel = new JSONModel({
        filters: {
          Matnr: "",
          Werks: "",
          Stlal: "",
          Stlan: ""
        }
      });
      this.getView().setModel(oViewModel, "view");
    },

    onShowBom: function () {
      var oFilters = this.getView().getModel("view").getProperty("/filters");
      if (!oFilters.Matnr || !oFilters.Werks || !oFilters.Stlal || !oFilters.Stlan) {
        MessageToast.show("Please provide MATNR, WERKS, STLAL and STLAN.");
        return;
      }

      this.getOwnerComponent().getRouter().navTo("BomDetails", {
        Matnr: encodeURIComponent(oFilters.Matnr.trim()),
        Werks: encodeURIComponent(oFilters.Werks.trim()),
        Stlal: encodeURIComponent(oFilters.Stlal.trim()),
        Stlan: encodeURIComponent(oFilters.Stlan.trim())
      });
    }
  });
});
