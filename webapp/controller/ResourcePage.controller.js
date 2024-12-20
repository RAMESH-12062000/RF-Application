sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment"
],
    function (Controller, Device, JSONModel, Popover, Button, library, MessageToast, UIComponent, Fragment) {

        "use strict";

        return Controller.extend("com.app.rfapp.controller.ResourcePage", {
            sSelectedImageDataUrl: null,
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

                // Initialize JSON Model
                var oModel = new JSONModel();
                this.getView().setModel(oModel);

                // Load data asynchronously
                oModel.loadData(sap.ui.require.toUrl("com/app/rfapp/model/data.json"));
                oModel.attachRequestCompleted(function (oEvent) {
                    if (!oEvent.getParameter("success")) {
                        MessageToast.show("Failed to load data.");
                    }
                }.bind(this));
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);

                this.Themecall = false;
                this.EditCall = false;
                this._currentTile = null;
                this._selectedTiles = [];
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            // onAfterRendering: function () {
            //     // Apply stored theme color
            //     var sStoredThemeColor = localStorage.getItem("themeColor");
            //     if (sStoredThemeColor) this.applyThemeColor(sStoredThemeColor);

            //     // Apply stored tile colors
            //     var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");
            //     for (var sTileId in tileColors) {
            //         var sColor = tileColors[sTileId];
            //         var oTile = this.byId(this._extractLocalId(sTileId));

            //         if (oTile) {
            //             (function (oTile, sColor) {
            //                 oTile.addEventDelegate({
            //                     onAfterRendering: function () {
            //                         var oTileDom = oTile.getDomRef();
            //                         if (oTileDom) oTileDom.style.backgroundColor = sColor;
            //                     }
            //                 });
            //             })(oTile, sColor);
            //         }
            //     }
            //     // Apply stored view setting
            //     var sStoredView = localStorage.getItem("selectedView");
            //     if (sStoredView) {
            //         // Get the ScrollContainer and its content
            //         var oTilesContainer = this.byId("idScrollContainer1");
            //         var aTiles = oTilesContainer.getContent(); // Get all the tiles within the ScrollContainer
            //         aTiles.forEach(function (oTile) {
            //             // Check if the content is a GenericTile before proceeding
            //             if (oTile.isA("sap.m.GenericTile")) {
            //                 // Remove any previous size-related CSS classes
            //                 oTile.removeStyleClass("largeIcons");
            //                 oTile.removeStyleClass("mediumIcons");
            //                 oTile.removeStyleClass("smallIcons");

            //                 // Apply the stored size class
            //                 switch (sStoredView) {
            //                     case "LargeIcons":
            //                         oTile.addStyleClass("largeIcons");
            //                         break;
            //                     case "MediumIcons":
            //                         oTile.addStyleClass("mediumIcons");
            //                         break;
            //                     case "SmallIcons":
            //                         oTile.addStyleClass("smallIcons");
            //                         break;
            //                     default:
            //                         break;
            //                 }
            //             }
            //         });
            //         //oTilesContainer.rerender();
            //     }
            //     // Apply stored tile details (header and subheader)
            //     var tileIds = Object.keys(localStorage).filter(key => key.startsWith('tile_'));
            //     tileIds.forEach(function (tileKey) {
            //         // Extract the tile ID from the key
            //         var tileId = tileKey.replace('tile_', '');
            //         var storedTileData = JSON.parse(localStorage.getItem(tileKey));
            //         // Retrieve the tile by ID
            //         var oTile = this.byId(this._extractLocalId(tileId));
            //         // Apply the stored data to the tile if the tile exists
            //         if (oTile && storedTileData) {
            //             oTile.setHeader(storedTileData.header || "");
            //             oTile.setSubheader(storedTileData.subHeader || "");
            //         }
            //     }.bind(this));
            // },
            onAfterRendering: function () {
                debugger
                // Apply stored background color
                var sStoredBackgroundColor = localStorage.getItem("backgroundColor");
                if (sStoredBackgroundColor) {
                    this.applyBackgroundTheme(sStoredBackgroundColor, null);
                }

                // Apply stored background image
                var sStoredBackgroundImage = localStorage.getItem("backgroundImage");
                if (sStoredBackgroundImage) {
                    this.applyBackgroundTheme(null, sStoredBackgroundImage);
                }

                // Apply stored tile colors
                var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");
                for (var sTileId in tileColors) {
                    var sColor = tileColors[sTileId];
                    var oTile = this.byId(this._extractLocalId(sTileId));

                    if (oTile) {
                        (function (oTile, sColor) {
                            oTile.addEventDelegate({
                                onAfterRendering: function () {
                                    var oTileDom = oTile.getDomRef();
                                    if (oTileDom) oTileDom.style.backgroundColor = sColor;
                                }
                            });
                        })(oTile, sColor);
                    }
                }

                // Apply stored tile images
                var tileImages = JSON.parse(localStorage.getItem("tileImages") || "{}");
                for (var sTileId in tileImages) {
                    var sImageSrc = tileImages[sTileId];
                    var oTile = this.byId(this._extractLocalId(sTileId));

                    if (oTile) {
                        (function (oTile, sImageSrc) {
                            oTile.addEventDelegate({
                                onAfterRendering: function () {
                                    var oTileDom = oTile.getDomRef();
                                    if (oTileDom) {
                                        oTileDom.style.backgroundImage = `url(${sImageSrc})`;
                                        oTileDom.style.backgroundSize = "cover";
                                        oTileDom.style.backgroundPosition = "center";
                                        oTileDom.style.backgroundRepeat = "no-repeat";
                                        oTileDom.style.backgroundAttachment = "fixed";
                                    }
                                }
                            });
                        })(oTile, sImageSrc);
                    }
                }

                // Apply stored view setting
                var sStoredView = localStorage.getItem("selectedView");
                if (sStoredView) {
                    var oTilesContainer = this.byId("idScrollContainer1");
                    var aTiles = oTilesContainer.getContent();
                    aTiles.forEach(function (oTile) {
                        if (oTile.isA("sap.m.GenericTile")) {
                            oTile.removeStyleClass("largeIcons");
                            oTile.removeStyleClass("mediumIcons");
                            oTile.removeStyleClass("smallIcons");

                            switch (sStoredView) {
                                case "LargeIcons":
                                    oTile.addStyleClass("largeIcons");
                                    break;
                                case "MediumIcons":
                                    oTile.addStyleClass("mediumIcons");
                                    break;
                                case "SmallIcons":
                                    oTile.addStyleClass("smallIcons");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                }

                // Apply stored tile details (header and subheader)
                var tileIds = Object.keys(localStorage).filter(key => key.startsWith('tile_'));
                tileIds.forEach(function (tileKey) {
                    var tileId = tileKey.replace('tile_', '');
                    var storedTileData = JSON.parse(localStorage.getItem(tileKey));
                    var oTile = this.byId(this._extractLocalId(tileId));
                    if (oTile && storedTileData) {
                        oTile.setHeader(storedTileData.header || "");
                        oTile.setSubheader(storedTileData.subHeader || "");
                    }
                }.bind(this));

                // Apply the stored profile picture
                var sStoredProfileImage = localStorage.getItem("userProfileImage");
                if (sStoredProfileImage) {
                    var oAvatarControl = this.byId("id_GenAvatar1P");
                    if (oAvatarControl) {
                        oAvatarControl.setSrc(sStoredProfileImage);  // Set the stored image as the Avatar source
                    }
                }
            },
            _extractLocalId: function (sTileId) {
                return sTileId.split("--").pop();
            },
            onChatbotButtonPress: function () {
                window.open("https://cai.tools.sap/api/connect/v1/webclient/standalone/f05493db-d9e4-4bb4-8c10-7d4d681e7823", "_self");
            },

            onResetToDefaultPress: function () {
                sap.m.MessageBox.warning("Reset to default settings ?", {
                    title: "Default settings",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (status) {
                        if (status === sap.m.MessageBox.Action.OK) {
                            localStorage.clear();
                            sap.m.MessageToast.show("Settings reset to default.");
                            window.location.reload();
                        } else {
                            MessageToast.show("Reset to default settings cancelled.");
                        }
                    }
                });

            },
            onEditTileNamePress: function () {
                if (this.Themecall) {
                    sap.m.MessageBox.information("Please exit from theme mode first")
                    return;
                }
                this.EditCall = !this.EditCall; // Toggle the state
                if (this.EditCall) {
                    // Theme mode activated
                    this.byId("idBtnListView").setVisible(false);
                    this.byId("idCancelEditButtonResource").setVisible(true);
                    sap.m.MessageToast.show("Edit mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idCancelEditButtonResource").setVisible(false);
                    this.byId("idBtnListView").setVisible(true);
                    sap.m.MessageToast.show("Edit mode deactivated.");
                }
            },
            //Rename Dailog Box..
            onPressRenameTile: function () {
                debugger
                this.TileHeader = this._currentTile.getHeader();
                this.TileSubHeader = this._currentTile.getSubheader();
                this.getView().byId("IdEditTileDetailsDialogResource").open();
                this.byId("idInputTileHeaderResource").setValue(this.TileHeader);
                this.byId("idInputSubHeaderResource").setValue(this.TileSubHeader);
            },
            onPressSaveTileEditDetails: function () {
                debugger
                var sNewHeader = this.byId("idInputTileHeaderResource").getValue();
                var sNewSubHeader = this.byId("idInputSubHeaderResource").getValue();

                // Update the tile details
                if (this._currentTile) {
                    var tileId = this._currentTile.getId();
                    this._currentTile.setHeader(sNewHeader);
                    this._currentTile.setSubheader(sNewSubHeader);

                    var tileData = {
                        header: sNewHeader,
                        subHeader: sNewSubHeader // Store the new subheader
                    };
                    // Save the updated tile details in localStorage
                    localStorage.setItem(`tile_${tileId}`, JSON.stringify(tileData)); // Save tile data as a string in localStorage
                    this.byId("IdEditTileDetailsDialogResource").close();
                    sap.m.MessageToast.show("Tile details updated successfully!");
                }
                window.reload();
            },
            onCloseEditingTileDetailsDialog: function () {
                this.byId("IdEditTileDetailsDialogResource").close();
            },
            onCancelEditPress: function () {
                this.byId("idCancelEditButtonResource").setVisible(false);
                this.byId("idBtnListView").setVisible(true);
                this.EditCall = false;
                sap.m.MessageToast.show("Edit mode Deactivated.");
            },
            // Theme press from profile 
            onPressThemesResource: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this._oThemeSelectPopover) {
                    this._oThemeSelectPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.SelectToApplyTheme", this);
                    this.getView().addDependent(this._oThemeSelectPopover);
                }
                // Open popover near the language button
                this._oThemeSelectPopover.openBy(oEvent.getSource());
            },
            // Theme press from profile 
            onPressThemesBtnFromProfile: function (oEvent) {
                debugger
                // Check if the popover already exists, if not create it
                if (!this._oThemeSelectPopover) {
                    this._oThemeSelectPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.SelectToApplyTheme", this);
                    this.getView().addDependent(this._oThemeSelectPopover);
                }
                // Open popover near the language button
                this._oThemeSelectPopover.openBy(oEvent.getSource());
            },
            //Background theme select 
            onBackGroudThemeSelect: function () {
                if (this.EditCall) {
                    sap.m.MessageToast.show("Please exit Edit mode before selecting a theme.");
                    return;
                }
                if (this.Themecall) {
                    sap.m.MessageToast.show("Please exit Theme mode before selecting a theme.");
                    return;
                }
                this.resetDialogBox();
                this.byId("idthemeTileDialogResource").open();
            },
            //Tile selcect btn from Profile Popover...
            onTileThemeSelect: function () {
                // Check if edit mode is active
                if (this.EditCall) {
                    sap.m.MessageBox.information("Please exit from edit mode first");
                    return;
                }
                // Toggle the Themecall state
                this.Themecall = !this.Themecall;

                if (this.Themecall) {
                    this.byId("idExitThemeModeResource").setVisible(true); // Show the Exit Theme button
                    this.byId("idTileThemesModeOpen").setVisible(true); // Show the Open Theme button
                    this.byId("idBtnListView").setVisible(false); // Show the Open Theme button
                    sap.m.MessageToast.show("Theme mode activated.");
                } else {
                    // Theme mode deactivated
                    this.byId("idExitThemeModeResource").setVisible(false); // Hide the Exit Theme button
                    this.byId("idTileThemesModeOpen").setVisible(false); // Hide the Open Theme button
                    this.byId("idBtnListView").setVisible(true);
                    sap.m.MessageToast.show("Theme mode deactivated.");
                }
            },
            //Closing Theme Dailog Box...
            onCancelColorDialog: function () {
                this.resetDialogBox();
                //this._selectedTiles = [];
                this.byId("idthemeTileDialogResource").close();
            },
            //After Selecting Multiple Tiles opens theme dialog box to select colour...
            onPressTileThemesModeOpenDailog: function () {
                debugger
                var selectedTiles = this._selectedTiles || [];
                // Check if any tiles are selected
                if (selectedTiles.length === 0) {
                    sap.m.MessageToast.show("Please select at least one tile to apply the theme.");
                    return;
                }
                // Extract only the IDs from the selected tiles
                this._selectedTileIds = selectedTiles.map(function (tile) {
                    return tile.getId();
                });
                this.resetDialogBox();
                this.byId("idthemeTileDialogResource").open();
            },
            //Exit from Theme Mode...
            onPressExitTileThemesMode: function () {
                this.Themecall = false; // Deactivate theme call
                // Deselect all tiles visually
                if (this._selectedTiles && this._selectedTiles.length > 0) {
                    this._selectedTiles.forEach(function (oTile) {
                        oTile.removeStyleClass("tileSelected");
                    });
                }
                // Clear the array of selected tiles
                this._selectedTiles = [];
                // Reset button visibility as needed
                this.byId("idBtnListView").setVisible(true);
                this.byId("idTileThemesModeOpen").setVisible(false);
                this.byId("idExitThemeModeResource").setVisible(false);
                // Optionally, close the theme dialog if it's open
                var oDialog = this.byId("idthemeTileDialogResource");
                if (oDialog && oDialog.isOpen()) {
                    oDialog.close();
                }
                this.resetDialogBox();
                sap.m.MessageToast.show("Theme mode Exited!");
            },
            //Apply btn ThemeDailog Box...
            // onApplyColor: function () {
            //     var oView = this.getView();
            //     var oColorPicker = oView.byId("idcolorPickerResource");
            //     var sColorPickerValue = oColorPicker.getColorString();
            //     var aSelectedColors = [];
            //     var oColorOptions = this.byId("colorOptionsResource").getItems();

            //     // Collect selected colors from checkboxes
            //     oColorOptions.forEach(function (oItem) {
            //         if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
            //             var sColorValue = oItem.getCustomData()[0].getValue(); // Get color from custom data
            //             aSelectedColors.push(sColorValue);
            //         }
            //     });

            //     // If a color is selected from checkboxes
            //     if (aSelectedColors.length > 0) {
            //         if (aSelectedColors.length > 1) {
            //             sap.m.MessageToast.show("You can only select one color.");
            //             return;
            //         }
            //         if (oColorPicker.getVisible()) {
            //             sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");
            //             return;
            //         }

            //         var sSelectedColor = aSelectedColors[0];
            //         if (this.Themecall) {
            //             // If tile theme mode is active, apply the color to the tiles
            //             this.applyColorToTiles(sSelectedColor);
            //         } else {
            //             // Apply the color as the background theme
            //             this.applyThemeColor(sSelectedColor);
            //             sap.m.MessageToast.show("Background color applied successfully!");
            //         }
            //     } else if (this._isValidColor(sColorPickerValue)) {
            //         // If no checkbox is selected, apply the color from the color picker
            //         if (this.Themecall) {
            //             this.applyColorToTiles(sColorPickerValue);
            //         } else {
            //             this.applyThemeColor(sColorPickerValue);
            //             sap.m.MessageToast.show("Background color applied successfully!");
            //         }
            //     } else {
            //         sap.m.MessageToast.show("Invalid color format. Please use a valid color code.");
            //     }
            //     this.resetDialogBox();
            //     this.byId("idthemeTileDialogResource").close();
            // },
            // //For Background Theme and Callback function from "onApplyColor"...
            // applyThemeColor: function (sColor) {
            //     var aElements = [
            //         this.byId("idScrollContainer1"),
            //     ];

            //     // Remove any existing style element for the theme
            //     var sStyleId = "customThemeStyle";
            //     var oOldStyle = document.getElementById(sStyleId);
            //     if (oOldStyle) {
            //         oOldStyle.remove();
            //     }

            //     // Create a new style element and apply the color
            //     var oStyle = document.createElement("style");
            //     oStyle.id = sStyleId;
            //     oStyle.textContent = ".customTheme { background-color: " + sColor + " !important; }";
            //     document.head.appendChild(oStyle);

            //     // Add the custom theme class to the elements
            //     aElements.forEach(function (oElement) {
            //         if (oElement) {
            //             oElement.addStyleClass("customTheme");
            //         }
            //     });
            //     localStorage.setItem("themeColor", sColor);
            // },
            // //Tiles Color Callback function from "onApplyColor"
            // applyColorToTiles: function (sColor) {
            //     if (!this._selectedTiles || this._selectedTiles.length === 0) {
            //         sap.m.MessageToast.show("No tiles selected for color application.");
            //         return;
            //     }

            //     this._selectedTiles.forEach(function (oTile) {
            //         var oTileDomRef = oTile.getDomRef();
            //         if (oTileDomRef) {
            //             oTileDomRef.style.backgroundColor = sColor;

            //             // Update localStorage with tile color
            //             var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");
            //             tileColors[oTile.getId()] = sColor;
            //             localStorage.setItem("tileColors", JSON.stringify(tileColors));
            //         }
            //     });
            //     if (this._selectedTiles && this._selectedTiles.length > 0) {
            //         this._selectedTiles.forEach(function (oTile) {
            //             oTile.removeStyleClass("tileSelected");
            //         });
            //     }
            //     sap.m.MessageToast.show("Colors applied to selected tiles successfully!");
            //     // Reset the selected tiles array after applying the colors
            //     this._selectedTiles = [];
            // },
            // onColorOptionSelect: function (oEvent) {
            //     var oSelectedCheckBox = oEvent.getSource();
            //     var oColorOptions = this.byId("colorOptionsResource").getItems();
            //     // Deselect all other checkboxes except the currently selected one
            //     oColorOptions.forEach(function (oItem) {
            //         if (oItem instanceof sap.m.CheckBox && oItem !== oSelectedCheckBox) {
            //             oItem.setSelected(false);
            //         }
            //     });
            //     // Hide the color picker if a checkbox is selected, show if deselected
            //     var isCheckBoxSelected = oSelectedCheckBox.getSelected();
            //     this.byId("idcolorPickerResource").setVisible(!isCheckBoxSelected);
            // },
            // // Reset the dialog box when canceled or after applying the color
            // resetDialogBox: function () {
            //     var oView = this.getView();
            //     var oColorPicker = oView.byId("idcolorPickerResource");
            //     var oColorOptions = this.byId("colorOptionsResource").getItems();

            //     // Deselect all checkboxes
            //     oColorOptions.forEach(function (oItem) {
            //         if (oItem instanceof sap.m.CheckBox) {
            //             oItem.setSelected(false);
            //         }
            //     });
            //     // Reset the color picker to its default value
            //     oColorPicker.setColorString("#FFFFFF");
            //     oColorPicker.setVisible(true);
            // },
            // // Helper function to extract the local ID of a tile
            // _extractLocalId: function (sTileId) {
            //     return sTileId.split("--").pop();
            // },
            // _isValidColor: function (sColor) {
            //     var hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
            //     var rgbRegex = /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;
            //     return hexRegex.test(sColor) || rgbRegex.test(sColor);
            // },
            onApplyColor: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("idcolorPickerResource");
                var sColorPickerValue = oColorPicker.getColorString();
                var aSelectedColors = [];
                var oColorOptions = this.byId("colorOptionsResource").getItems();

                // Collect selected colors from checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
                        var sColorValue = oItem.getCustomData()[0].getValue(); // Get color from custom data
                        aSelectedColors.push(sColorValue);
                    }
                });

                // Determine which color or image to apply
                var sColor = null;
                if (aSelectedColors.length > 0) {
                    if (aSelectedColors.length > 1) {
                        sap.m.MessageToast.show("You can only select one color.");
                        return;
                    }
                    sColor = aSelectedColors[0];
                } else if (this._isValidColor(sColorPickerValue)) {
                    sColor = sColorPickerValue;
                }

                // Apply either the selected color or uploaded image
                if (this._uploadedImageSrc) {
                    this.applyTheme(null, this._uploadedImageSrc); // Apply image if uploaded
                } else if (sColor) {
                    this.applyTheme(sColor, null); // Apply color if valid
                } else {
                    sap.m.MessageToast.show("No valid color or image selected.");
                }
                this.resetDialogBox();
                this.byId("idthemeTileDialogResource").close();
            },
            applyTheme: function (sColor, sImageSrc) {
                if (this._selectedTiles && this._selectedTiles.length > 0) {
                    this.applyThemeToTiles(sColor, sImageSrc);
                } else {
                    this.applyBackgroundTheme(sColor, sImageSrc);
                }
            },
            applyThemeToTiles: function (sColor, sImageSrc) {
                if (!this._selectedTiles || this._selectedTiles.length === 0) {
                    sap.m.MessageToast.show("No tiles selected for theme application.");
                    return;
                }

                var tileImages = JSON.parse(localStorage.getItem("tileImages") || "{}");
                var tileColors = JSON.parse(localStorage.getItem("tileColors") || "{}");

                // Iterate over the selected tiles
                this._selectedTiles.forEach(function (oTile) {
                    var oTileDomRef = oTile.getDomRef();
                    if (oTileDomRef) {
                        var tileId = oTile.getId();

                        // Remove any existing background settings for the tile
                        oTileDomRef.style.backgroundImage = "";
                        oTileDomRef.style.backgroundColor = "";
                        delete tileImages[tileId];
                        delete tileColors[tileId];

                        // Apply the new image if available
                        if (sImageSrc) {
                            oTileDomRef.style.backgroundImage = `url(${sImageSrc})`;
                            oTileDomRef.style.backgroundSize = "cover";
                            oTileDomRef.style.backgroundPosition = "center";
                            oTileDomRef.style.backgroundRepeat = "no-repeat";
                            oTileDomRef.style.backgroundAttachment = "fixed";
                            tileImages[tileId] = sImageSrc; // Save the image to local storage
                            sap.m.MessageToast.show("image applied for selected tiles!");
                        }
                        // If no image is available, apply the new color if provided
                        else if (sColor) {
                            oTileDomRef.style.backgroundColor = sColor;
                            tileColors[tileId] = sColor; // Save the color to local storage
                            sap.m.MessageToast.show("Colour applied for selected tiles!");
                        }
                    }
                }.bind(this));

                // Save the updated tile images and colors to local storage
                localStorage.setItem("tileImages", JSON.stringify(tileImages));
                localStorage.setItem("tileColors", JSON.stringify(tileColors));

                // Remove the 'tileSelected' style class and clear the selected tiles list
                this._selectedTiles.forEach(function (oTile) {
                    oTile.removeStyleClass("tileSelected");
                });
                this._selectedTiles = [];
                this.resetDialogBox();
            },
            applyBackgroundTheme: function (sColor, sImageSrc) {
                var oMainContainer = this.byId("idScrollContainer1");
                if (oMainContainer) {
                    var oMainContainerDom = oMainContainer.getDomRef();

                    // Clear any existing background settings
                    oMainContainerDom.style.backgroundImage = "";
                    oMainContainerDom.style.backgroundColor = ""; // Clear any set background color
                    oMainContainer.removeStyleClass("customTheme");

                    // Apply new background image settings
                    if (sImageSrc) {
                        oMainContainerDom.style.backgroundImage = `url(${sImageSrc})`;
                        oMainContainerDom.style.backgroundSize = "cover";
                        oMainContainerDom.style.backgroundPosition = "center";
                        oMainContainerDom.style.backgroundRepeat = "no-repeat";
                        oMainContainerDom.style.backgroundAttachment = "fixed";

                        sap.m.MessageToast.show("Background image applied successfully!");

                        // Save the newest background image and remove the stored background color
                        localStorage.setItem("backgroundImage", sImageSrc);
                        localStorage.removeItem("backgroundColor"); // Ensure only one background setting is stored
                    } else if (sColor) {
                        // Remove any previous custom theme style element based on ID
                        var sStyleId = "customThemeStyle";
                        var oOldStyle = document.getElementById(sStyleId);
                        if (oOldStyle) {
                            oOldStyle.remove();
                        }
                        // Create a new style element and apply the color
                        var oStyle = document.createElement("style");
                        oStyle.id = sStyleId;
                        oStyle.textContent = ".customTheme { background-color: " + sColor + " !important; }";
                        document.head.appendChild(oStyle);

                        // Add the custom theme class to the element
                        oMainContainer.addStyleClass("customTheme");

                        sap.m.MessageToast.show("Background color applied successfully!");

                        // Save the newest background color and remove the stored background image
                        localStorage.setItem("backgroundColor", sColor);
                        localStorage.removeItem("backgroundImage"); // Ensure only one background setting is stored
                    }
                }
            },
            onPressBackgroundTilesBG: function () {
                var oFileUploader = this.byId("idBrowseImgfileUploaderTilesBG");

                var bIsVisible = oFileUploader.getVisible();
                oFileUploader.setVisible(!bIsVisible);  // Toggle visibility
            },
            // onFileUploadChange: function (oEvent) {
            //     var aFiles = oEvent.getParameter("files");
            //     if (aFiles.length > 0) {
            //         var oFile = aFiles[0];
            //         var reader = new FileReader();

            //         reader.onload = function (e) {
            //             // Save the uploaded image source as base64 string
            //             this._uploadedImageSrc = e.target.result;

            //             // Hide color picker and color options after an image is selected
            //             this.byId("idcolorPickerResource").setVisible(false);
            //             this.byId("colorOptionsResource").setVisible(false);
            //             MessageToast.show("Image selected. Now press 'Apply' to save!");
            //         }.bind(this);

            //         reader.readAsDataURL(oFile);
            //     } else {
            //         this.byId("idcolorPickerResource").setVisible(true);
            //         this.byId("colorOptionsResource").setVisible(true);
            //         MessageToast.show("No image selected. Please choose an image.");
            //     }
            // }, 
            onFileUploadChange: function (oEvent) {
                var aFiles = oEvent.getParameter("files");
                if (aFiles.length > 0) {
                    var oFile = aFiles[0];

                    // Validate file type based on mime type
                    var validTypes = ["image/jpeg", "image/png", "image/gif"];
                    if (validTypes.indexOf(oFile.type) === -1) {
                        MessageToast.show("Please upload a valid image file (JPG, PNG, GIF).");
                        return;
                    }

                    // // Validate file size (1MB = 1048576 bytes)
                    // if (oFile.size > 1048576) {
                    //     MessageToast.show("The file size exceeds the limit of 1MB.");
                    //     return;
                    // }

                    var reader = new FileReader();

                    reader.onload = function (e) {
                        // Save the uploaded image source as a base64 string
                        this._uploadedImageSrc = e.target.result;

                        // Hide color picker and color options after an image is selected
                        this.byId("idcolorPickerResource").setVisible(false);
                        this.byId("colorOptionsResource").setVisible(false);
                        MessageToast.show("Image selected. Now press 'Apply' to save!");
                    }.bind(this);

                    reader.readAsDataURL(oFile);
                } else {
                    this.byId("idcolorPickerResource").setVisible(true);
                    this.byId("colorOptionsResource").setVisible(true);
                    MessageToast.show("No image selected. You can choose other option.");
                }
            },
            onColorOptionSelect: function (oEvent) {
                var oSelectedCheckBox = oEvent.getSource();
                var oColorOptions = this.byId("colorOptionsResource").getItems();

                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem !== oSelectedCheckBox) {
                        oItem.setSelected(false);
                    }
                });

                var isCheckBoxSelected = oSelectedCheckBox.getSelected();
                this.byId("idcolorPickerResource").setVisible(!isCheckBoxSelected);
                this.byId("idBrowseImgfileUploaderTilesBG").setVisible(!isCheckBoxSelected);
            },
            resetDialogBox: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("idcolorPickerResource");
                var oColorOptions = this.byId("colorOptionsResource").getItems();
                var oImageUploader = this.byId("idBrowseImgfileUploader");

                // Deselect all checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox) {
                        oItem.setSelected(false);
                    }
                });

                // Reset the color picker to its default value (white)
                if (oColorPicker) {
                    oColorPicker.setColorString("#FFFFFF");
                    oColorPicker.setVisible(true);
                }
                // Clear any stored uploaded image source
                this._uploadedImageSrc = null;

                // Reset the file uploader (clear any selected files)
                if (oImageUploader) {
                    oImageUploader.clear();
                }
                this.byId("colorOptionsResource").setVisible(true);
                this.byId("idBrowseImgfileUploaderTilesBG").setVisible(true);
            },
            _isValidColor: function (sColor) {
                var hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
                var rgbRegex = /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;
                return hexRegex.test(sColor) || rgbRegex.test(sColor);
            },
            //Tile View setting When press on profile...
            onPressTileViewSettings: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this.oTileViewSettings) {
                    this.oTileViewSettings = sap.ui.xmlfragment("com.app.rfapp.fragments.UserTileView", this);
                    this.getView().addDependent(this.oTileViewSettings);
                }
                // Open popover near the language button
                this.oTileViewSettings.openBy(oEvent.getSource());
            },
            onPressTileViewLargeIcons: function () {
                this.onPressTileViewResizeIcons("LargeIcons");
            },
            onPressTileViewMediumIcons: function () {
                this.onPressTileViewResizeIcons("MediumIcons");
            },
            onPressTileViewSmallIcons: function () {
                this.onPressTileViewResizeIcons("SmallIcons");
            },
            //CallBack function every Tile view....
            onPressTileViewResizeIcons: function (sSelectedKey) {
                if (this.Themecall) {
                    sap.m.MessageToast.show("Please exit Theme mode.");
                    return;
                }
                if (this.EditCall) {
                    sap.m.MessageToast.show("Please exit Edit mode.");
                    return;
                }
                var oTilesContainer = this.byId("idScrollContainer1");
                var aTiles = oTilesContainer.getContent(); // Get all the tiles within the ScrollContainer
                // Save the selected key to localStorage
                localStorage.setItem("selectedView", sSelectedKey);
                // Loop through each tile and apply the appropriate style class based on the selected view
                aTiles.forEach(function (oTile) {
                    // Check if the content is a GenericTile before proceeding
                    if (oTile.isA("sap.m.GenericTile")) {
                        // Remove any previous size-related CSS classes
                        oTile.removeStyleClass("largeIcons");
                        oTile.removeStyleClass("mediumIcons");
                        oTile.removeStyleClass("smallIcons");

                        // Apply the selected size class
                        switch (sSelectedKey) {
                            case "LargeIcons":
                                oTile.addStyleClass("largeIcons");
                                break;
                            case "MediumIcons":
                                oTile.addStyleClass("mediumIcons");
                                break;
                            case "SmallIcons":
                                oTile.addStyleClass("smallIcons");
                                break;
                            default:
                                break;
                        }
                    }
                });
                // oTilesContainer.rerender();
                // var oModel = this.getView().getModel();
                // oModel.refresh(true);
            },
            onPressListGridViewsResource: async function () {
                debugger;
                const oModel1 = this.getOwnerComponent().getModel();
                const userId = this.ID; // Assuming this.ID is set when loading user data
                const oTilesContainer = this.byId("idScrollContainer1");
                let userTiles = [];
                let currentView = localStorage.getItem("currentView") || "DefaultView";

                // Fetch user tiles from the backend
                await new Promise((resolve, reject) => {
                    oModel1.read(`/RESOURCESSet('${userId}')`, {
                        success: function (oData) {
                            const tiles = oData.Queue; // Adjust this based on your data structure
                            // Clean up tile names: remove spaces and convert to lowercase
                            userTiles = tiles.split(',')
                                .map(item => item.trim().toLowerCase().replace(/\s+/g, ''));
                            resolve();
                        },
                        error: function () {
                            MessageToast.show("Error loading user tiles");
                            reject();
                        }
                    });
                });

                // Extract and clean frontend tile IDs
                const frontEndTileIds = oTilesContainer.getContent()
                    .filter(oTile => oTile.isA("sap.m.GenericTile")) // Ensure it's a GenericTile
                    .map(oTile => {
                        const sTileId = oTile.getId();
                        const localId = this._extractLocalId(sTileId);
                        return localId.replace("id_", "").toLowerCase();
                    });

                // Match frontend tile IDs with backend queue tile names
                const matchedTiles = frontEndTileIds.filter(tileId => userTiles.includes(tileId));

                // Get the original tile objects for the matched tile IDs
                const matchedTileIds = matchedTiles.map(tileId => {
                    const matchedTile = oTilesContainer.getContent().find(oTile => {
                        const sTileId = oTile.getId();
                        const localId = this._extractLocalId(sTileId);
                        return localId.replace("id_", "").toLowerCase() === tileId;
                    });
                    return matchedTile ? matchedTile.getId() : null; // Get the original ID or null if not found
                }).filter(id => id !== null); // Filter out any null values

                console.log("Matched Tile IDs:", matchedTileIds); // Log the matched tile IDs

                // Toggle between ListGridView and DefaultView
                if (currentView === "DefaultView") {
                    localStorage.setItem("currentView", "ListGridView");

                    // Adjust layout to list/grid view
                    oTilesContainer.getContent().forEach((oTile) => {
                        if (oTile.isA("sap.m.GenericTile")) {
                            // Apply list/grid specific style
                            oTile.removeStyleClass("largeIcons mediumIcons smallIcons").addStyleClass("listgridIcons");

                            // const oTileHeader = oTile.getHeader();
                            // const oTileSubheader = oTile.getSubheader();

                            // // Create a new container to hold the header and subheader
                            // const oHeaderContainer = new sap.m.VBox({
                            //     items: [
                            //         new sap.m.Text({ text: oTileHeader }),
                            //         new sap.m.Text({ text: oTileSubheader })
                            //     ]
                            // });

                            // // Add the header container beside the tile
                            // oTile.setHeader(""); // Clear the header since we are setting it in a new container
                            // oTile.addContent(oHeaderContainer);
                        }
                    });
                } else {
                    // Reset to the stored view
                    localStorage.setItem("currentView", "DefaultView");
                    // Retrieve the previously stored view
                    const sStoredView = localStorage.getItem("selectedView") || "selectedView";
                    // Adjust back to grid view
                    oTilesContainer.getContent().forEach((oTile) => {
                        if (oTile.isA("sap.m.GenericTile")) {
                            // Restore the original size class for the grid view
                            oTile.removeStyleClass("listgridIcons").addStyleClass(sStoredView);
                        }
                    });
                    oTilesContainer.rerender();
                }
            },
            onPressAccountDetails: async function () {
                const oModel1 = this.getOwnerComponent().getModel();
                const userId = this.ID;

                // Fetch user details from the backend
                await new Promise((resolve, reject) => {
                    oModel1.read(`/RESOURCESSet('${userId}')`, {
                        success: function (oData) {
                            const userDetails = oData; // Adjust this based on your data structure
                            // Set user data in a new model or update existing model
                            const oUserModel = new sap.ui.model.json.JSONModel(userDetails);
                            this.getView().setModel(oUserModel, "oUserModel"); // Set the model with name
                            resolve();
                        }.bind(this), // Bind this to ensure the context is correct
                        error: function () {
                            MessageToast.show("Error loading user tiles");
                            reject();
                        }
                    });
                });

                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.app.rfapp.fragments.UserDetails", this);
                    this.getView().addDependent(this._oDialog); // Makes sure the dialog is cleaned up when the view is destroyed
                }
                this._oDialog.open();
                var sStoredProfileImage = localStorage.getItem("userProfileImage");
                if (sStoredProfileImage) {
                    var oProfileAvatarControl = this._oDialog.mAggregations.content[0].mAggregations.items[0];
                    if (oProfileAvatarControl) {
                        oProfileAvatarControl.setSrc(sStoredProfileImage);  // Set the stored image as the Avatar source
                    }
                }
            },
            onPressDeclineProfileDetailsDailog: function () {
                if (this._oDialog) {
                    this._oDialog.close();
                }
            },
            //Changing the profile pics...
            onPressProfileImageAvatar: function () {
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                // Add an event listener to handle the file selection
                fileInput.addEventListener("change", (event) => {
                    var selectedFile = event.target.files[0];
                    if (selectedFile) {
                        var reader = new FileReader();
                        reader.onload = (e) => {
                            var selectedImageBase64 = e.target.result; // Get the base64 encoded image
                            var oImageControl1 = this._oDialog.mAggregations.content[0].mAggregations.items[0];
                            var oImageControl2 = this._oPopover.mAggregations.content[0]._aElements[0].mAggregations.items[0].mAggregations.items[0];
                            var oImageControl3 = this.oView.mAggregations.content[0].mAggregations.pages[0].mAggregations.header.mAggregations.content[8];
                            // Set the src for each image control
                            oImageControl1.setSrc(selectedImageBase64);
                            oImageControl2.setSrc(selectedImageBase64);
                            oImageControl3.setSrc(selectedImageBase64);

                            // Store the image in localStorage
                            localStorage.setItem("userProfileImage", selectedImageBase64);
                            sap.m.MessageToast.show("Profile image updated successfully!");
                        };
                        reader.readAsDataURL(selectedFile);
                    }
                });
                fileInput.click();
            },
            onPressPopoverProfileImageAvatar: function () {
                debugger
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                // Add event listener to handle the file selection
                fileInput.addEventListener("change", (event) => {
                    var selectedFile = event.target.files[0];
                    if (selectedFile) {
                        var oReader = new FileReader();
                        // Set up the onload event for FileReader
                        oReader.onload = (oEvent) => {
                            var sBase64Image = oEvent.target.result;
                            var oImageControl1 = this._oDialog.mAggregations.content[0].mAggregations.items[0];
                            var oImageControl2 = this._oPopover.mAggregations.content[0]._aElements[0].mAggregations.items[0].mAggregations.items[0];
                            var oImageControl3 = this.oView.mAggregations.content[0].mAggregations.pages[0].mAggregations.header.mAggregations.content[8];

                            // Set the image sources for the controls
                            oImageControl1.setSrc(sBase64Image);
                            oImageControl2.setSrc(sBase64Image);
                            oImageControl3.setSrc(sBase64Image);

                            // Store the image in localStorage
                            localStorage.setItem("userProfileImage", sBase64Image);
                            MessageToast.show("Profile image updated successfully!");
                        };
                        // Read the selected file as a Data URL (base64 string)
                        oReader.readAsDataURL(selectedFile);
                    } else {
                        MessageToast.show("Please select an image to upload.");
                    }
                });
                fileInput.click();
            },
            //Language Transulation PopOver Profile...
            onPressLanguageTranslation: function (oEvent) {
                // Check if the popover already exists, if not create it
                if (!this._oLanguagePopover) {
                    this._oLanguagePopover = sap.ui.xmlfragment("com.app.rfapp.fragments.LanguageTransulations", this);
                    this.getView().addDependent(this._oLanguagePopover);
                }
                // Open popover near the language button
                this._oLanguagePopover.openBy(oEvent.getSource());
            },
            onLanguageSelect: function (oEvent) {
                // Get the selected button text
                var sLanguage = oEvent.getSource().getText();

                // Define the message based on the selected language
                var sSpeechText = "";

                switch (sLanguage) {
                    case "English":
                        sSpeechText = "You have chosen English language.";
                        break;
                    case "Hindi":
                        sSpeechText = "आपने हिंदी भाषा चुनी है।"; // Speech for Hindi
                        break;
                    case "Spanish":
                        sSpeechText = "Has elegido el idioma español."; // Speech for Spanish
                        break;
                    case "French":
                        sSpeechText = "Vous avez choisi la langue française."; // Speech for French
                        break;
                    default:
                        sSpeechText = "Language selection failed.";
                }

                // Use Web Speech API to make the sound announcement
                this._announceLanguageSelection(sSpeechText);
                // Close the popover after selection
                this._oPopover.close();
            },

            // Function to handle sound announcements
            _announceLanguageSelection: function (speechText) {
                if ('speechSynthesis' in window) {
                    var speech = new SpeechSynthesisUtterance(speechText);

                    // Optional: Set the language of the speech
                    if (speechText.includes("हिंदी")) {
                        speech.lang = 'hi-IN'; // Hindi language setting
                    } else if (speechText.includes("español")) {
                        speech.lang = 'es-ES'; // Spanish language setting
                    } else if (speechText.includes("française")) {
                        speech.lang = 'fr-FR'; // French language setting
                    } else {
                        speech.lang = 'en-US'; // English as default
                    }

                    window.speechSynthesis.speak(speech);
                } else {
                    console.log("Speech Synthesis not supported in this browser.");
                }
            },
            onResourceDetailsLoad: async function (oEvent1) {

                // const { id } = oEvent1.getParameter("arguments");
                // this.ID = id;
                // console.log(this.ID)
                // var oModel = this.getView().getModel();

                // var oModel1 = this.getOwnerComponent().getModel();

                // await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                //     success: function (oData) {
                //         var area = oData.Area;
                //         var group = oData.Resourcegroup;
                //         var resourceType = oData.Queue;
                //         var aNavigationData = oModel.getProperty("/navigation");

                //            // Define which process and item to show
                //         debugger
                //         var sProcessToShow =  area;
                //         var sItemToShow =   group;

                //         // Loop through navigation data
                //         aNavigationData.forEach(function (oProcess) {
                //             // Loop through items of each process
                //             oProcess.items.forEach(function (oItem) {
                //                 // Set visibility based on the matching process and item
                //                 if (oProcess.title === sProcessToShow && oItem.title === sItemToShow) {
                //                     oProcess.visible = true; 
                //                     oItem.visible = true;  // Set to true for matching item
                //                 } else {
                //                     oItem.visible = false; // Ensure all others are set to false
                //                 }
                //             });
                //         });

                //         // Update the model with modified visibility data
                //         oModel.setProperty("/navigation", aNavigationData);
                //         var aNavigationData = oModel.getProperty("/navigation");



                //         // You can perform further actions here, like navigating to the next view
                //     }.bind(this),
                //     error: function () {
                //         MessageToast.show("User does not exist");
                //     }
                // });
                //   const sToolPage = this. getView().byId("toolPage");
                //   sToolPage.bindElement(`/(${id})`);

                var that = this;
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                console.log(this.ID);

                var oModel = this.getView().getModel();
                var oModel1 = this.getOwnerComponent().getModel();

                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        var area = oData.Area;
                        var areaArray = area.split(",").map(item => item.trim());
                        var ogroup = oData.Resourcegroup;
                        var groupArray = ogroup.split(",").map(item => item.trim());

                        // groupArray.forEach(function (group) {

                        //     let oGroup = group.replace(/[^a-zA-Z0-9]/g, '');
                        //     let loGroup = oGroup.toLowerCase();
                        //     that.getView().byId(`id_${loGroup}_title`).setVisible(true)
                        // })

                        var oresourceType = oData.Queue;
                        var oResourceArray = oresourceType.split(",").map(item => item.trim())
                        console.log(oResourceArray)
                        oResourceArray.forEach(function (queue) {

                            let oQueue = queue.replace(/[^a-zA-Z0-9]/g, '');
                            let lOQueue = oQueue.toLowerCase();
                            that.getView().byId(`id_${lOQueue}`).setVisible(true)
                        })

                        var aNavigationData = oModel.getProperty("/navigation");

                        // Loop through navigation data
                        aNavigationData.forEach(function (oProcess) {
                            var processVisible = false;

                            // Loop through areaArray
                            areaArray.forEach(function (areaArray1) {
                                var Area = `${areaArray1} Process`;

                                // Check if the process title matches any in the formatted array
                                if (oProcess.title === Area) {
                                    oProcess.visible = true;
                                    processVisible = true; // Mark this process as visible
                                }
                            });

                            // If no area matched, set process to false
                            if (!processVisible) {
                                oProcess.visible = false;
                            }

                            // Loop through items of each process
                            oProcess.items.forEach(function (oItem) {
                                // Set visibility of items based on the matching group and the process visibility
                                if (groupArray.includes(oItem.title) && oProcess.visible) {
                                    oItem.visible = true;
                                } else {
                                    oItem.visible = false;
                                }
                            });
                        });

                        // Update the model with modified visibility data after all processing
                        oModel.setProperty("/navigation", aNavigationData);

                        // Further actions can be performed here, like navigating to the next view
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },

            onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer1").to(this.getView().createId(oItem.getKey()));
            },

            handleUserNamePress: function (event) {
                var oPopover = new Popover({
                    showHeader: false,
                    placement: PlacementType.Bottom,
                    content: [
                        new Button({
                            text: 'Feedback',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Help',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Logout',
                            type: ButtonType.Transparent
                        })
                    ]
                }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

                oPopover.openBy(event.getSource());
            },

            onSideNavButtonPress: function () {
                var oToolPage = this.byId("toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();

                this._setToggleButtonTooltip(bSideExpanded);

                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },

            _setToggleButtonTooltip: function (bLarge) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                if (bLarge) {
                    oToggleButton.setTooltip('Large Size Navigation');
                } else {
                    oToggleButton.setTooltip('Small Size Navigation');
                }
            },
            onManuallyRepackHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ManuallyRepackHU", { id: this.ID });
                }
            },
            onManuallyRepackHUItemPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ManuallyRepackAllHUItems", { id: this.ID });
                }
            },
            onPutawayByHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePutawayByHU", { id: this.ID });
                }
            },
            onReceivingofHUbyConsignementOrderPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("Receivingofhubyco", { id: this.ID });

                }
            },
            onManuallyRepackHUItemPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteManuallyRepackingByHuItems", { id: this.ID });
                }
            },
            onWTQuerybyWOPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }


                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByWO", { id: this.ID });
                }
            },
            onReceivingofHUbyDeliveryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RecevingOfHUbyDelivery", { id: this.ID });
                }
            },
            onReceivingofHUbymanufacturingOrderPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RecevingOfHUbyManufacturingOrder", { id: this.ID });
                }
            },
            onRecevingofTUDoorTWPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RecevingOfHUbyTUorDoor", { id: this.ID });
                }
            },
            onReceivingofHUbyASNPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingofHUbyASN", { id: this.ID });
                }
            },
            onReceivingofHUbyShipmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingofHUbyShipment", { id: this.ID });
                }
            },
            onReceivingofHUbyTUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingofHUbyTU", { id: this.ID });
                }
            },
            onUnloadingByDoorTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByDoor", { id: this.ID });
                }
            },
            onUnloadingByConsignmentOrderTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByConsignmentOrder", { id: this.ID });
                }
            },
            onChangeQueueTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ChangeQueue", { id: this.ID });
                }
            },
            onChangeResourceGroupTilePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ChangeResourceGroup", { id: this.ID });
                }
            },
            onUnloadingbyBillofLadingPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByBillofLading", { id: this.ID });
                }
            },
            onDeconsolidationAutomaticallyPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("DeconsolidationAutomatically", { id: this.ID });
                }
            },
            onDeconsolidateManuallyPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("DeconsolidationManually", { id: this.ID });
                }
            },
            onAdhocInventoryCreationPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AdhocInventoryCreation", { id: this.ID });
                }
            },
            onCreationOfSingleHUpress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreationOfSingleHU", { id: this.ID });
                }
            },
            onMaintainHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("MaintainHU", { id: this.ID });
                }
            },
            onReversalofConsumptionbyMOHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReversalofConsumptionbyMObyHU", { id: this.ID });
                }
            },
            onReversalofconsumptionbyMOBinPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteReversalofConsumptionbyMO_Bin", { id: this.ID });
                }
            },
            onUnloadingByShipmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByShipment", { id: this.ID });
                }
            },
            onUnloadingByTransportUnitPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadingByTU", { id: this.ID });
                }
            },
            // onSBQPAvatarPressed: function () {
            //     var oView = this.getView();

            //     // Create the dialog lazily
            //     if (!this._pProfileDialog) {
            //         this._pProfileDialog = Fragment.load({
            //             id: oView.getId(),
            //             name: "com.app.rfapp.fragments.ProfileDialog",
            //             controller: this
            //         }).then(function (oDialog) {
            //             oView.addDependent(oDialog);
            //             return oDialog;
            //         });
            //     }

            //     this._pProfileDialog.then(function (oDialog) {
            //         oDialog.open();
            //     });
            // },
            onSBQPAvatarPressed: function (oEvent) {
                debugger;

                // Reference to the current instance
                var This = this;

                // Get the model (assuming it's an OData model)
                var oModel1 = this.getOwnerComponent().getModel();

                // Read data using OData model
                oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        // Assuming 'Users' and 'Resourceid' are available in the oData response
                        let oUser = oData.Users.toLowerCase();

                        if (oUser === "resource") {
                            var oProfileData = {
                                Name: oData.Resourcename, // Assuming this is the field you want to bind
                                Number: oData.Phonenumber // Add a fallback if 'ContactNumber' is missing
                            };

                            // Bind data to the popover
                            var oPopoverModel = new sap.ui.model.json.JSONModel(oProfileData);

                            // Check if the popover is already created
                            if (!This._oPopover) {
                                This._oPopover = sap.ui.xmlfragment("com.app.rfapp.fragments.ProfileDialog", This);
                                This.getView().addDependent(This._oPopover);
                            }

                            // Now that the popover exists, set the model
                            This._oPopover.setModel(oPopoverModel, "profile");

                            // Open popover near the avatar
                            This._oPopover.openBy(oEvent.getSource());
                            //Apply the stored profile pic for the PopOver...
                            var sStoredProfileImage = localStorage.getItem("userProfileImage");
                            if (sStoredProfileImage) {
                                var oProfilepicPopOverPerson = this._oPopover.mAggregations.content[0]._aElements[0].mAggregations.items[0].mAggregations.items[0];
                                if (oProfilepicPopOverPerson) {
                                    oProfilepicPopOverPerson.setSrc(sStoredProfileImage);
                                }
                            }
                        } else {
                            MessageToast.show("User is not a resource.");
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },

            onCloseDialog: function () {
                this._pProfileDialog.then(function (oDialog) {
                    oDialog.close();

                })
            },



            // onProfilePressed: function () {
            //     debugger;
            //     var oView = this.getView();

            //     // Save reference to 'this'
            //     var that = this; // Preserves the correct context of 'this'

            //     var oModelRead = this.getOwnerComponent().getModel();

            //     // Read data using OData model
            //     oModelRead.read("/RESOURCESSet('" + this.ID + "')", {
            //         success: function (oData) {
            //             // Assuming 'Users' and 'Resourceid' are available in the oData response
            //             let oUser = oData.Users.toLowerCase();

            //             if (oUser === "resource") {
            //                 var oProfileDialogData = {
            //                     Id: oData.Resourceid,
            //                     Name: oData.Resourcename,
            //                     Email: oData.Email,
            //                     Number: oData.Phonenumber // Assuming this is the field you want to bind
            //                 };

            //                 // Bind data to the dialog (use 'that' instead of 'This')
            //                 var oPopoverModel = new sap.ui.model.json.JSONModel(oProfileDialogData);
            //                 that.byId("idUserDetails").setModel(oPopoverModel, "profile");
            //             } else {
            //                 MessageToast.show("User is not a resource.");
            //             }
            //         },
            //         error: function () {
            //             MessageToast.show("User does not exist");
            //         }

            //     });


            //     // Check if the dialog already exists
            //     if (!this.byId("idUserDetails")) {
            //         // Load the fragment asynchronously
            //         Fragment.load({
            //             id: oView.getId(),
            //             name: "com.app.rfapp.fragments.UserDetails", // Adjust to your namespace
            //             controller: this
            //         }).then(function (oDialog) {
            //             // Add the dialog to the view
            //             oView.addDependent(oDialog);
            //             var Oopen = oDialog.open();
            //             if (Oopen) {
            //                 // Reference to the current instance


            //                 // Get the model (assuming it's an OData model)

            //             }
            //         });
            //     } else {
            //         // If the dialog already exists, just open it
            //         this.byId("idUserDetails").open();
            //     }
            // },


            onMyAccountPress: function () {
                sap.m.MessageToast.show("Navigating to My Account...");
            },

            onLogoutPress: function () {
                sap.m.MessageToast.show("Logging out...");
                // Add actual logout logic here
            },
            onRecevinngofHUbyBillofLadingPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteBillofLading", { id: this.ID });
                }
            },
            onCreateShippingHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreateShippingHU", { id: this.ID });
                }
            },
            onCreateShippingHUWOWCPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreateShippingHUWOWC", { id: this.ID });
                }
            },
            onPutawayByWOPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("PutawayByWO", { id: this.ID });
                }
            },
            onWTquerybyHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByHU", { id: this.ID });
                }
            },
            onSetReadyforWHprocessingbyCOPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("SetReadyforWHProcessingByCO", { id: this.ID });
                }
            },
            onAutomaticallyRepackHUItemPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AutomaticallyRepackHUItem", { id: this.ID });
                }
            },
            onAvailableHandlingunitsonbinqueryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }

                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AvailableHandlingUnitsOnBinQuery", { id: this.ID });
                }
            },

            onWTQueryByWTPress: function () {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByWT", { id: this.ID });
                }
            },
            onCreateandConfirmAdhocProductWTPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreateConfirmAdhocProduct", { id: this.ID });
                }
            },
            onSerialnumberLocationPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("SerialNumberLocation", { id: this.ID });
                }
            },
            onStockBinQuerybyProductPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }
                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("StockBinQueryByProduct", { id: this.ID });
                }
            },
            onCreateAdhocHUWTPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AdhocHuWt", { id: this.ID });
                }
            },
            onCreateAdhocProductWTPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AdhocProductWt", { id: this.ID });
                }
            },
            onReceivingofHUbyDoorPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ReceivingOfHuByDoor", { id: this.ID });
                }
            },
            onStockBinQuerybyBinPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("StockBinQueryByBin", { id: this.ID });
                }
            },
            onHUQueryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("HuQuery", { id: this.ID });
                }
            },
            onUnloadingByDeliveryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    // Proceed with normal navigation
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("UnloadByDelivery", { id: this.ID });
                }
            },
            onUnloadingByASNPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteUnloadingASNDetails", { id: this.ID });
                }
            },
            onWTQuerybyQueuePress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("WTQueryByQueue", { id: this.ID });
                }
            },
            onPickPointPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("PickPoint", { id: this.ID });
                }
            },
            onManuallyrepackallHUitemsPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ManuallyRepackAllHUItems", { id: this.ID });
                }
            },
            onHUStockOverviewQueryPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("HUStockOverviewQuery", { id: this.ID });
                }
            },
            onConsumptionByManufacturingOrderPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ConsumptionByManufacturingOrder", { id: this.ID });
                }
            },
            onCreatePutawayHusforDeconsolidationPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreatePutawayHusforDeconsolidate", { id: this.ID });
                }
            },
            onCreatePutawayHusManuallyPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("CreatePutawayHusManually", { id: this.ID });
                }
            },
            onLoadByHUManPosAssigmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("LoadbyHUManPosAssiognment", { id: this.ID });
                }
            },
            onPutawayByHUClusteredPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePutawayHuClustered", { id: this.ID });
                }
            },
            onAutomaticallyRepackHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("AutomaticallyRepackHu", { id: this.ID });
                }
            },
            onLoadByHUAutoPosAssignmentPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("LoadbyHUAutoPosAssiognment", { id: this.ID });
                }
            },

            onProductInspectionByHUPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByHU", { id: this.ID });
                }
            },
            onProductInspectionByStorageBinPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
                }
            },

            onProductInspectionByStorageBinPress: function (oEvent) {
                if (this.EditCall) {
                    this._currentTile = oEvent.getSource();
                    this.onPressRenameTile()

                }
                else if (this.Themecall) {
                    // Get the ID of the pressed tile
                    this._currentTile = oEvent.getSource();
                    // Open the theme dialog for tile color selection
                    // this.onBackgroundTilePopOverThemeBtn();
                    this.onBackgroundTilePopOverThemeBtn()

                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("ProductInspectionByStorageBin", { id: this.ID });
                }
            },

            onHUMaintenanceInDeconsolidation: function (oEvent) {
                var oTile = oEvent.getSource();
                if (this.EditCall) {
                    this._currentTile = oTile;
                    this.onPressRenameTile();
                } else if (this.Themecall) {
                    if (!this._selectedTiles) {
                        this._selectedTiles = [];
                    }

                    // Check if the tile is already selected
                    var iTileIndex = this._selectedTiles.indexOf(oTile);
                    if (iTileIndex !== -1) {
                        sap.m.MessageToast.show("Tile Deselected.");
                        // Remove the tile from the selected array and remove the highlight
                        this._selectedTiles.splice(iTileIndex, 1);
                        oTile.removeStyleClass("tileSelected");
                    } else {
                        this._selectedTiles.push(oTile);
                        oTile.addStyleClass("tileSelected");
                        sap.m.MessageToast.show("Tile Selected.");
                    }
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("HuMaintanaceInDeconsolidation", { id: this.ID });
                }
            },
            onCloseUSerDetailsDialog: function () {
                this.byId("idUserDetails").close();
            },
            onSignoutPressed: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("InitialScreen", { id: this.ID });

            },
        });
    });