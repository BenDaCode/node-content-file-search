//command prompt
var cmd={
    ask:function(question, callback) {

        var r = rl.createInterface({
                input: process.stdin,
                output: process.stdout
            });

        r.question(question + '\n', function(answer) {

            r.close();
            callback(answer);
        });
    },
    progress:function(progress) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(progress);
    }
}

//read folders recursively
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

//read files from folder
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

//programm logic
var run=function(){

    console.log("process started");
    cmd.ask("select dircetory:", function(answer){

        var myFolder=answer;

        if(fs.lstatSync(myFolder).isDirectory()){

            console.log("start is "+myFolder);

            cmd.ask("Enter value:", function(answer){

                var myTerm=answer;

                if(myTerm.length>0){
                    console.log("searching for \""+myTerm+"\"");

                    readDir(myFolder, function(err, result) {
                    
                        if(!err){
                            console.log("searching in "+result.length+" files");

                            readFiles(result,myTerm,function(response){
                                
                                if(response!=""){

                                    console.log("found \""+myTerm+"\" in "+response.length+" files");

                                    cmd.ask("Show results? (Y/N)", function(answer){
                                        
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
                }else{
                    console.log("no search value defined");
                }
            });
        }else{
            console.log("cirectory not found");
        }
    });
}

return {
    run:run
}

})();

const fs = require('fs');
const path = require('path');
const rl = require('readline');

app.run();