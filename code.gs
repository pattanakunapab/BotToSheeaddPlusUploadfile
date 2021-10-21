var sheetName = 'ชีต1'
var scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  
// Logger.log(e)
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {

/** ส่วนการรับภาพ decode  */
  const folderId = "1Ik_QlNKVcCl7_vwr_q5FPsdGVtb5ajrG";  // Folder ID image

  const blob = Utilities.newBlob(JSON.parse(e.postData.contents), e.parameter.mimeType, e.parameter.filename);
  
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  const responseObj = {filename: file.getName(), fileId: file.getId(), fileUrl: file.getUrl()};
  
  // const blob2 = Utilities.newBlob(JSON.parse(e.postData.contents), e.parameter.mimeType2, e.parameter.filenameb);
  
  // const file2 = DriveApp.getFolderById(folderId).createFile(blob2);
  // const responseObj2 = {filename2: file2.getName(), fileId2: file2.getId(), fileUrl2: file2.getUrl()};
  
  // Logger.log(responseObj2)
 /** สิ้นสุด การ decode */ 
  
	var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
	var sheet = doc.getSheetByName(sheetName)

	var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
	var nextRow = sheet.getLastRow() + 1

	var newRow = headers.map(function(header) {
	  return header === 'timestamp' ? new Date() : e.parameter[header]
	})
  sheet.getRange(nextRow,2).setNumberFormat('@STRING@')
  sheet.getRange(nextRow,8).setNumberFormat('@STRING@')
  sheet.getRange(nextRow,9).setNumberFormat('@STRING@')

	sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

  //ส่วนการทำงานส่งลิงค์ภาพเข้าชีต
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ชีต1')   
      sheet.getRange(ss.getLastRow(),20).setValue(responseObj['fileId'])     
      // sheet.getRange(ss.getLastRow(),22).setValue(responseObj2['fileId2'])    
       
    var getim_id = sheet.getRange(ss.getLastRow(),20).getDisplayValue()
    var IMAGE_URL_1 = 'https://doc.google.com/uc?export=view&id='+ getim_id;    
      sheet.getRange(ss.getLastRow(),21).setValue(IMAGE_URL_1)
Logger.log("xxxx")
	return ContentService
	  .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
	  .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
	return ContentService
	  .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
	  .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
	lock.releaseLock()
  }
}

