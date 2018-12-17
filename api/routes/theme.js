const express = require('express');
const router = express.Router();
const model = require('../database/database');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json()

router.post('/',  jsonParser,(req, res, next) => {

    if (!req.body.name)
        res.status(500).json({"error" : `You can't send empty body. Fill body with {"name": "<Theme for voting>"} format`});   

    if (req.body.name.length > 1024)
        res.status(200).json({error: "Name length cannot be greater than 1024"});

    let name = req.body.name;

    model.setTheme(name, function(error, result, fields){
        res.status(201).json({
            "error": null,
            "themeId": result.insertId
        });   
    });
});

router.get('/:themeId', (req, res, next) => {

    let themeId = parseInt(req.params.themeId);

    if(isNaN(themeId)){
        res.status(200).json({"error" : "Id must be numeric"});
        return;
    }

    let successQueriesCount = 3;
    let queriesCount = 0;

    let resultJson = {
        name: "",
        votes: {
            yes : 0,
            no : 0
        }
    };

    var sendJsonResult = function(){
        res.status(200).json(resultJson);
    }

    model.getThemeById(themeId, function(error, result, fields){

        if(error){
            res.status(200).json({"error": "Some trouble with db send message to admin."});
            return;
        }

        if(result.length !== 0){
            resultJson.name = result[0].name;
        }
        else{
            res.status(200).json({"error": "No theme with such id."});
            return;
        }
            
        queriesCount++;    

        if(successQueriesCount === queriesCount){
            sendJsonResult();
        }

    });

    for(let key in resultJson.votes){

        model.getVotesCount(themeId, key, function(error, result, fields){

            if(error){
                res.status(200).json({"error": "Some trouble with db send message to admin."});
                return;
            }
            
            resultJson.votes[key] = result[0].count;
            queriesCount++;
        
            if(successQueriesCount === queriesCount){
                sendJsonResult();
            }
        });
    }

    
});

router.post('/:themeId/:optionName', (req, res, next) => {

    let themeId = req.params.themeId;
    let optionName = req.params.optionName;
    let optionId;
    let successQueriesCount = 2;
    let queriesCount = 0;

    const sendJsonResult = function(){
        model.setVote(themeId, optionId, function(error, result, fields){
            
            if(error){
                res.status(500);
            }
            
            res.status(200).json({
                "error":null, 
                "message":"OK"
            });

        });
    }

    // Get option 
    model.getOptionByName(optionName, function(error, result, fields){
        
        if(error)
            res.status(200).json({"error": "No option with such name."});

        optionId = result[0].id;
        queriesCount++        
        
        if(queriesCount === successQueriesCount){
            sendJsonResult()
        }
    });

    model.getThemeById(themeId, function(error, result, fields){
        
        if(error)
            res.status(200).json({"error": "No theme with such id."});

        queriesCount++        
        
        if(queriesCount === successQueriesCount){
            sendJsonResult()
        }

    });

});

module.exports = router;
