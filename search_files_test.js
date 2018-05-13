var app=(function(){

    var result=[];

    var readData=function(folder,term){
    
        var thisFolder=folder;
    
        fs.readdir(folder,function(err,files){

            if(!err){
                for(var file in files){

                    var extension=path.extname(files[file]);
                    var thisPath=thisFolder+'\\'+files[file]; 
        
                    console.log("checking "+thisPath)
            
                    var isDirectory=fs.statSync(thisPath).isDirectory();
                    
                    if(isDirectory){
                        readData(thisPath,term);
                    }else{
            
                        if(extension=='.php'){
            
                            fs.readFile(thisPath, 'utf8', function(err, data) {
                                
                                if(data){
                                    if(data.indexOf(term) >= 0){
                                        result.push("match found in "+thisPath);

                                        //console.log("match found in "+thisPath);
                                    }
                                }
                            });
                        }
                    } 

                }
            }
        });
    }

    var run=function() {
        console.log("process started");
        console.log("start is "+myFolder);
        console.log("searching for "+myTerm);
        readData(myFolder,myTerm);
    }

    return {
        run:run
    }
    
})(myFolder,myTerm);

/*Ziel ist es die Variable result mit den betroffenen Dateien zu befüllen. Aufgrund der Asynchronität und der Rekusrion finde ich keinen weg, dies zu tun */

const fs = require('fs');
const path = require('path');

var myFolder="your start folder";
var myTerm="what you are searching for";

app.run();



