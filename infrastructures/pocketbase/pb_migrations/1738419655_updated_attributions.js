/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1129391060")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1559091573",
    "max": null,
    "min": null,
    "name": "proposed_budget",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1129391060")

  // remove field
  collection.fields.removeById("number1559091573")

  return app.save(collection)
})
