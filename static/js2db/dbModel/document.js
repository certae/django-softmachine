
// Document template, used only if there is no diagram in database
var jsonDocument = [
                    {
                        "type": "dbModel.shape.DBTable",
                        "id": "63c0f27a-716e-804c-6873-cd99b945b63f",
                        "x": 80,
                        "y": 59,
                        "width": 98,
                        "height": 81.265625,
                        "userData": null,
                        "cssClass": "DBTable",
                        "bgColor": "#DBDDDE",
                        "color": "#D7D7D7",
                        "stroke": 1,
                        "alpha": 1,
                        "radius": 3,
                        "tableName": "Enterprise",
                        "tablePorts": [
                        	{
                        		"type": "draw2d_InputPort",
                        		"name": "input0",
                        		"position": "default"
                        	},
                        	{
                        		"type": "draw2d_OutputPort",
                        		"name": "output0",
                        		"position": "default"
                        	},
                        	{
                        		"type": "draw2d_HybridPort",
                        		"name": "hybrid0",
                        		"position": "bottom"
                        	}
                        ],
                        "attributes": [
                          {
                            "text": "blubber",
                            "id": "49be7d78-4dcf-38ab-3733-b4108701fce4",
			                "datatype": "int",
			                "pk": true,
			                "fk": false,
			                "isNullable": false,
                    		"isRequired": true
                          }
                        ]
                      },
                      {
                        "type": "dbModel.shape.DBTable",
                        "id": "3253ff2a-a920-09d5-f033-ca759a778e19",
                        "x": 295,
                        "y": 59,
                        "width": 98,
                        "height": 151.53125,
                        "userData": null,
                        "cssClass": "DBTable",
                        "bgColor": "#DBDDDE",
                        "color": "#D7D7D7",
                        "stroke": 1,
                        "alpha": 1,
                        "radius": 3,
                        "tableName": "UsageLogiciel",
                        "tablePorts": [
                        	{
                        		"type": "draw2d_InputPort",
                        		"name": "input0",
                        		"position": "default"
                        	},
                        	{
                        		"type": "draw2d_OutputPort",
                        		"name": "output0",
                        		"position": "default"
                        	},
                        	{
                        		"type": "draw2d_OutputPort",
                        		"name": "output1",
                        		"position": "default"
                        	}
                        ],
                        "attributes": [
                          {
                            "text": "id",
                            "id": "e97f6f8a-4306-0667-3a95-0a5310a2c15c",
			                "datatype": "int",
			                "pk": true,
			                "fk": false,
			                "isNullable": false,
                    		"isRequired": true
                          },
                          {
                            "text": "firstName",
                            "id": "357e132c-aa47-978f-a1fa-d13da6736989",
			                "datatype": "string",
			                "pk": false,
			                "fk": false,
			                "isNullable": true,
                    		"isRequired": false
                          },
                          {
                            "text": "lastName",
                            "id": "a2156a71-f868-1f8f-e9a1-b185dbdfc3de",
			                "datatype": "string",
			                "pk": false,
			                "fk": false,
			                "isNullable": true,
                    		"isRequired": false
                          },
                          {
                            "text": "company_fk",
                            "id": "8d410fef-5c6e-286d-c9c3-c152d5bd9c52",
			                "datatype": "int",
			                "pk": false,
			                "fk": true,
			                "isNullable": true,
                    		"isRequired": false
                          }
                        ]
                      },
                      {
                        "type": "dbModel.shape.DBTable",
                        "id": "2810494b-931f-da59-fd9d-6deba4385fe0",
                        "x": 540,
                        "y": 85,
                        "width": 98,
                        "height": 81.265625,
                        "userData": null,
                        "cssClass": "DBTable",
                        "bgColor": "#DBDDDE",
                        "color": "#D7D7D7",
                        "stroke": 1,
                        "alpha": 1,
                        "radius": 3,
                        "tableName": "Logiciel",
                        "tablePorts": [
                        	{
                        		"type": "draw2d_InputPort",
                        		"name": "input0",
                        		"position": "default"
                        	},
                        	{
                        		"type": "draw2d_OutputPort",
                        		"name": "output0",
                        		"position": "default"
                        	},
                        	{
                        		"type": "draw2d_HybridPort",
                        		"name": "hybrid0",
                        		"position": "top"
                        	}
                        ],
                        "attributes": [
                          {
                            "text": "id",
                            "id": "e04ebb27-43c9-1afa-a7d0-e55bf2aa62d5",
			                "datatype": "int",
			                "pk": true,
			                "fk": false,
			                "isNullable": false,
                    		"isRequired": true
                          }
                        ]
                      },
                      {
                        "type": "dbModel.shape.TableConnection",
                        "id": "f8735797-cf1d-8431-d891-c2d10f0a67be",
                        "name": "Connection t1 t2",
                        "userData": null,
                        "cssClass": "draw2d_Connection",
                        "stroke": 2,
                        "color": "#5BCAFF",
                        "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
                        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                        "source": {
                          "node": "3253ff2a-a920-09d5-f033-ca759a778e19",
                          "port": "output1"
                        },
                        "target": {
                          "node": "2810494b-931f-da59-fd9d-6deba4385fe0",
                          "port": "input0"
                        }
                      },
                      {
                        "type": "dbModel.shape.TableConnection",
                        "id": "abf0a3d6-c4d0-a4d4-569c-094083429e70",
                        "name": "Connection t2 t3",
                        "userData": null,
                        "cssClass": "draw2d_Connection",
                        "stroke": 2,
                        "color": "#5BCAFF",
                        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
                        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                        "source": {
                          "node": "63c0f27a-716e-804c-6873-cd99b945b63f",
                          "port": "output0"
                        },
                        "target": {
                          "node": "3253ff2a-a920-09d5-f033-ca759a778e19",
                          "port": "input0"
                        }
                      }
                    ];