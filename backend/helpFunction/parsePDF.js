import pdfParse from "pdf-parse"

export default class parsePDF {
    static async render_page (file) {
    //check documents https://mozilla.github.io/pdf.js/
        let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
            normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
            disableCombineTextItems: false
        }
 
    // return pdfParse(file)
    // .then(textContent => {
    //   console.log("textcontent", textContent)
    //     let lastY, text = '';
    //     for (let i=0; i<textContent.text; i++) {
    //         // if (lastY == item.transform[5] || !lastY){
    //         //     text += item.str;
    //         // }  
    //         // else{
    //         //     text += '\n' + item.str;
    //         // }    
    //         // lastY = item.transform[5];
    //         //console.log("item", item)
    //         if(textContent.text[i]!= '\n')
    //           text += textContent.text[i]
    //     }
    //     //console.log("text", text)
    //     return text;
    // });
    let text = ""
    try {
        const parsedFile = await pdfParse(file)
        for (let i=0; i<parsedFile.text; i++) {
                    // if (lastY == item.transform[5] || !lastY){
                    //     text += item.str;
                    // }  
                    // else{
                    //     text += '\n' + item.str;
                    // }    
                    // lastY = item.transform[5];
                    //console.log("item", item)
                    if(parsedFile.text[i]!= '\n')
                      text += parsedFile.text[i]
                }
                //console.log("text", text)
        return text;
    } catch (error) {
        console.log(error)
    }
}

}