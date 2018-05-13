
var app=(function(){

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
    
    var readFiles=function(path,term,result){

        fs.readFile(path, 'utf8', function(err, data) {
            if(data){
                if(data.indexOf(term) >= 0){
                  result("match found in "+path);
                }
            }
        });
    
    };

    var getTotal=function(){

        readDir(myFolder, function(err, result) {
        
            if (err){
                console.log(err);
            }else{
                console.log(result.length+" files are affected");
            }
          });
    }
    
    var run=function(){

        console.log("process started");
        console.log("start is "+myFolder);
        console.log("searching for "+myTerm);
    
        readDir(myFolder, function(err, result) {
        
            if (err){
                console.log(err);
            }else{
                console.log("searching in "+result.length+" files");

                for(var file in result){
                    readFiles(result[file],myTerm,function(response){
                        console.log(response);
                    })
                }
            }
        
          });
    }

    return {
        run:run,
        affected:getTotal
    }
    
})(myFolder,myTerm);

const fs = require('fs');
const path = require('path');

var myFolder="your folder";
var myTerm="your search value";

app.affected();
app.run();





