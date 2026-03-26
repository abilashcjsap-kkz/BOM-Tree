# BOM Tree Fiori App (VS Code + Fiori Tools)

This repository now contains a ready-to-adapt **SAPUI5 freestyle app skeleton** for your BOM hierarchy use case.

## What this app does

- **Screen 1 (Input):** Captures BOM key fields:
  - `Matnr` (Material)
  - `Werks` (Plant)
  - `Stlal` (Alternative BOM)
  - `Stlan` (BOM Usage)
- **Screen 2 (Details):** Calls your OData V2 service `ZBOM_TREE_SRV` (`treeSet`) and displays:
  - Component (`Idnrk`)
  - Description (`Ojtxp`)
  - Quantity (`Mnglg`)
  - UoM (`Meins`)
  - Level (`Stufe`)
- Builds a **hierarchical tree** from flat results using `Stufe` values.

---

## Generate the project in Visual Studio Code

1. Install extensions in VS Code:
   - **SAP Fiori tools - Extension Pack**
2. Open Command Palette (`Ctrl+Shift+P`) and run:
   - `Fiori: Open Application Generator`
3. Use:
   - Template: **SAPUI5 Freestyle**
   - Floorplan: **Basic**
   - Data source: **Connect to an SAP system**
4. Provide system details for your ABAP server and select service:
   - `ZBOM_TREE_SRV`
5. Choose main entity set:
   - `treeSet`
6. Finish generator.
7. Replace generated `webapp` files with files from this folder, or copy the logic into your generated app.

---

## Service setup

Update the destination/service URL in `webapp/manifest.json`:

- For BTP destination scenario keep `/sap/opu/odata/sap/ZBOM_TREE_SRV/`
- For local testing with direct host, use a proper proxy or configure `ui5.yaml` and destination.

> Note: Your metadata currently has many key fields; this app filters by Matnr/Werks/Stlal/Stlan and then shows full record set returned.

---

## Run locally

```bash
npm install
npm start
```

(Use the scripts from your generated Fiori project; if not present, add standard UI5 tooling scripts.)

---

## STUFE hierarchy logic

The app converts flat rows into a tree:

- `Stufe = 0` or first encountered row is treated as root-level node.
- Next rows attach to the nearest parent whose level is exactly one less.
- If a strict parent is not found, it falls back to the closest previous lower-level parent.

If your ABAP output uses a different hierarchy rule, adjust `buildTreeFromFlatData` in `BomDetails.controller.js`.
