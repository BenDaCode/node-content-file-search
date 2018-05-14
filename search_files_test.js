var app=(function(){

    var ask=function(question, callback) {

        var r = rl.createInterface({
                input: process.stdin,
                output: process.stdout
            });

        r.question(question + '\n', function(answer) {

            r.close();
            callback(answer);
        });
    }

    var readDir=function(folder,done){

        var result=[];

        fs.readdir(folder,function(err,files){
            
            var pending=files.length;

            if(!pending){
                done(null,result);
            }
        
            files.forEach(function(file) {

                var fileExtension=path.extname(file);
                var filePath=path.resolve(folder, file);
            
                fs.stat(filePath, function(err, stat) {
        
                    if (stat && stat.isDirectory()) {
            
                        readDir(filePath, function(err, response) {
            
                            result = result.concat(response);
            
                            if (!--pending){
                                done(null, result);
                            }
                        });
            
                    } else {
                        result.push(filePath);

                        if (!--pending){
                            done(null, result);
                        }
                    }
                });
            });
        });
    }
    
    var readFiles=function(files,term,done){

        var array=[];
        var pending=files.length;

        files.forEach(function(file){
            fs.readFile(file, 'utf8', function(err, data) {
                if(data){
                    if(data.indexOf(term) >= 0){
                        array.push("match found in "+file);
                    }
                }

                if(!--pending){
                    done(array);
                }
            });
        });
    }

    var run=function(){

        console.log("process started");
        console.log("start is "+myFolder);
        console.log("searching for \""+myTerm+"\"");
        
        readDir(myFolder, function(err, result) {
        
            if(!err){
                console.log("searching in "+result.length+" files");

                readFiles(result,myTerm,function(response){
                    
                    if(response!=""){

                        console.log("found \""+myTerm+"\" in "+response.length+" files");

                        ask("Show results? (Y/N)", function(answer){
                            
                            switch(answer.toUpperCase()){
                                case "Y":
                    
                                    response.forEach(function(text){
                                        console.log(text);
                                    });

                                    break;
                                default:
                                    console.log("end");
                            }

                        });
                    }else{
                        console.log("no files with \""+myTerm+"\" found");
                    }
                })
               
            }else{
                console.log(err);
            }
        });
    }

    return {
        run:run
    }
    
})(myFolder,myTerm);

const fs = require('fs');
const path = require('path');
const rl = require('readline');

var myFolder="your folder / location";
var myTerm="your value";

app.run();