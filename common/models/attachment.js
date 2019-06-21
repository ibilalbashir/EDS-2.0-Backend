'use strict';

const path = require('path')
var xlsx = require('xlsx');
var app = require('../../server/server')

module.exports = function (Attachment) {
  Attachment.afterRemote('upload', async function (ctx, modelInstance, next) {


    var fileName = modelInstance.result.files[''][0].name;
    var newData = await getCSV(fileName);

    await app.models.Product.create(newData, function (err, obj) {
      if (err) {
        console.log(err)
      } else {
        console.log(obj)

      }

    })
    ctx.res.setHeader('Content-Type', 'application/json');
    ctx.res.end(JSON.stringify(newData));
    next();


  })
};

function getCSV(fileName) {
  console.log('in getCSV method');

  var filePath = path.normalize('server/files/container/' + fileName);


  console.log(filePath);

  // var tmp = path.dirname('')

  // XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { raw: true, defval: null })

  var wb = xlsx.readFile(filePath);

  var ws = wb.Sheets["Sheet1"];

  var data = xlsx.utils.sheet_to_json(ws, { raw: true, defval: null });


  var newData = data.map(function (element) {
    var obj = {
      "supplierID": element.SupplierID,
      "supplierPartID": element['SupplierPart#'],
      "quantityBackOrdered": element.QuantityBackordered,
      "quantityOnOrder": element.QuantityonHand,
      "itemNextAvailabilityDate": element.ItemNextAvailabilityDate,
      "discontinued": element.Discontinued,
      "productName": element['ProductName/Options'],
      "productUrl": element['Product URL']
    }
    return obj;
  })

  return newData;


}
