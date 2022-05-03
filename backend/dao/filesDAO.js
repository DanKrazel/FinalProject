import mongodb from "mongodb"
import pdfParse from "pdf-parse"



const ObjectId = mongodb.ObjectId


/*const files = require('multer-gridfs-storage')({
  db: connection.db,
  file: (req, file) => {
    return {
      filename: file.originalname
    }
  }
});*/


let files
export default class filesDAO {
  static async injectDB(conn) {
    if (files) {
      return
    }
    try {
        files = await conn.db(process.env.RESTREVIEWS_NS).collection("files")
    } catch (e) {
      console.error(`Unable to establish collection handles in fileDAO: ${e}`)
    }
  }

  

    static async uploadFiletoDB (filename) {
      try {
        const fileDoc = {
            file : filename
        }
        console.log(fileDoc)
        return await files.insertOne(fileDoc)
      } catch (e) {
        console.error(`Unable to post file: ${e}`)
        return { error: e }
      }
    }

    static async getFiles({
      filters = null,
      page = 0,
      filesPerPage = 20,
    } = {}) {
      let query
      if (filters) {
        if ("_id" in filters) {
          query = { "_id": { $eq: filters["_id"] } }
        } else if ("file" in filters) {
          query = { "file": { $eq: filters["file"] } }
      }
  
      let cursor
      
      try {
        cursor = await files
          .find(query)
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return { fileList: [], totalNumFilesList: 0 }
      }
  
      const displayCursor = cursor.limit(filesPerPage).skip(filesPerPage * page)
  
      try {
        const filesList = await displayCursor.toArray()
        const totalNumFiles = await files.countDocuments(query)
  
        return { filesList, totalNumFiles }
      } catch (e) {
        console.error(
          `Unable to convert cursor to array or problem counting documents, ${e}`,
        )
        return { filesList: [], totalNumFiles: 0 }
      }
    }
  }


  static async uploadCSVtoDB (data) {
    // CSV file name
      //const fileName = "sample.csv";
      var arrayToInsert = [];
      // Fetching the all data from each row
      
  var i= 0;
  while(i!=data.length){
      for (var j = 0; j < data.length; j++) {
        if((source[j]["שם קורס"]=="חדו'א  - 1") && ( source[j]["שם קורס"]!="")){
         var oneRow = {
          codeCourse: source[j]["קוד קורס"],
          yearOfLearning: source[j]["שנה"],
          semesterOfLearning: source[j]["סמס"],
          courseName: source[j]["שם קורס"],
          typeOfCourse: source[j]["סוג"],
          englishUnits: parseInt(source[j]["שס"]),
          units: parseFloat(source[j]["נזיכוי"]),
          grade: parseInt(source[j]["ציון"]),
          //passCourse: checkPassCourse(grade),
          studentID: ObjectId(studentID)
        };
        console.log(oneRow)
        arrayToInsert.push(oneRow);
        //students.updateOne({units:units+courseUnits})
        //StudentsDAO.updateUnitsStudent(studentID, source[i]["נזיכוי"])
        i=i++;
        break;

        
        
      }
    }
      for (var j = 0; j < data.length; j++) {
      if((source[j]["שם קורס"]=="אלגברה לינארית לתוכנה-ה") && ( source[j]["שם קורס"]!="")){
       var oneRow = {
        codeCourse: source[j]["קוד קורס"],
        yearOfLearning: source[j]["שנה"],
        semesterOfLearning: source[j]["סמס"],
        courseName: source[j]["שם קורס"],
        typeOfCourse: source[j]["סוג"],
        englishUnits: parseInt(source[j]["שס"]),
        units: parseFloat(source[j]["נזיכוי"]),
        grade: parseInt(source[j]["ציון"]),
        //passCourse: checkPassCourse(grade),
        studentID: ObjectId(studentID)
      };
      console.log(oneRow)
      arrayToInsert.push(oneRow);
      //students.updateOne({units:units+courseUnits})
      //StudentsDAO.updateUnitsStudent(studentID, source[i]["נזיכוי"])
      i=i++;
      break;
      
    }
  } 
      for (var j = 0; j < data.length; j++) {
    if((source[j]["שם קורס"]=="ארכיטקטורת מחשבים I") && ( source[j]["שם קורס"]!="")){
     var oneRow = {
      codeCourse: source[j]["קוד קורס"],
      yearOfLearning: source[j]["שנה"],
      semesterOfLearning: source[j]["סמס"],
      courseName: source[j]["שם קורס"],
      typeOfCourse: source[j]["סוג"],
      englishUnits: parseInt(source[j]["שס"]),
      units: parseFloat(source[j]["נזיכוי"]),
      grade: parseInt(source[j]["ציון"]),
      //passCourse: checkPassCourse(grade),
      studentID: ObjectId(studentID)
    };
    console.log(oneRow)
    arrayToInsert.push(oneRow);
    //students.updateOne({units:units+courseUnits})
    //StudentsDAO.updateUnitsStudent(studentID, source[i]["נזיכוי"])
    i=i++;
    break;
    
  }
  } 
  for (var j = 0; j < data.length; j++) {
    if((source[j]["שם קורס"]=="ארכיטקטורת מחשבים I") && ( source[j]["שם קורס"]!="")){
     var oneRow = {
      codeCourse: source[j]["קוד קורס"],
      yearOfLearning: source[j]["שנה"],
      semesterOfLearning: source[j]["סמס"],
      courseName: source[j]["שם קורס"],
      typeOfCourse: source[j]["סוג"],
      englishUnits: parseInt(source[j]["שס"]),
      units: parseFloat(source[j]["נזיכוי"]),
      grade: parseInt(source[j]["ציון"]),
      //passCourse: checkPassCourse(grade),
      studentID: ObjectId(studentID)
    };
    console.log(oneRow)
    arrayToInsert.push(oneRow);
    //students.updateOne({units:units+courseUnits})
    //StudentsDAO.updateUnitsStudent(studentID, source[i]["נזיכוי"])
    i=i++;
    
    break;
  }
  }        
}

for (var j = i; j < data.length; j++) {
  if(( source[j]["שם קורס"]!="")){
   var oneRow = {
    codeCourse: source[j]["קוד קורס"],
    yearOfLearning: source[j]["שנה"],
    semesterOfLearning: source[j]["סמס"],
    courseName: source[j]["שם קורס"],
    typeOfCourse: source[j]["סוג"],
    englishUnits: parseInt(source[j]["שס"]),
    units: parseFloat(source[j]["נזיכוי"]),
    grade: parseInt(source[j]["ציון"]),
    //passCourse: checkPassCourse(grade),
    studentID: ObjectId(studentID)
  };
  console.log(oneRow)
  arrayToInsert.push(oneRow);
  //students.updateOne({units:units+courseUnits})
  //StudentsDAO.updateUnitsStudent(studentID, source[i]["נזיכוי"])

  
}
}

      console.log("arrayToInsert : ")
      console.log(arrayToInsert)
      courses.insertMany(arrayToInsert, (err, result) => {
        if (err)
          console.log(err);
        if(result){
            console.log("Import CSV into database successfully.");
        }
       //inserting into the table "courses"    
    });
}

  static async getContentPDF(src) {
    const doc = await pdfjsLib.getDocument(src).promise // note the use of the property promise
    const page = await doc.getPage(1)
    return await page.getTextContent()
  }

  // static async getItemsPDF(src) {
  //   const pdfExtract = new PDFExtract();
  //   const options = {}; /* see below */
  //   pdfExtract.extract('test.pdf', options, (err, data) => {
  //   if (err) 
  //     return console.log(err);
  //   console.log(data);
  //   });
    
  
  // }

  

  static async postDataPDF (file) {
    //check documents https://mozilla.github.io/pdf.js/
    const fileParsed = await pdfParse(file)
    return fileParsed;
}


}
 