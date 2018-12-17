const mysql = require('mysql');
const squel = require('squel');

function DataBase (){
    
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'softindex',
        password: 'softindex',
        database : 'voting'
    });

    connection.connect();

    this.getThemeById = function(themeId, fn){

        let query = squel
            .select()
            .from('themes')
            .where(`id = ${themeId}`)
            .toString();
        
        connection.query(query, fn); 
    }

    this.getThemeByName = function(themeName, fn){
        
        let query = squel
            .select()
            .from('themes')
            .where(`name = ${themeName}`)
            .toString();

        connection.query(query, fn); 
    }

    this.setTheme = function(themeName, fn){
        let query = squel
            .insert()
            .into('themes')
            .set("name", themeName)
            .toString();
        
        connection.query(query, fn);
    }

    this.getOptionById = function(optionId, fn){

        let query = squel
            .select()
            .from('options')
            .where(`id = ${optionId}`)
            .toString();
                
        connection.query(query, fn);
    };

    this.getOptionByName = function(optionName, fn){
        let query = squel
            .select()
            .from('options')
            .where(`name = '${optionName}'`)
            .toString();
                
        connection.query(query, fn);
    }

    this.setOption = function(optionName, fn){
        let query = squel
            .select('id')
            .from('options')
            .where(`name = '${optionName}'`)
            .toString();
                
        connection.query(query, fn);
    };

    this.getVotesCount = function(themeId, voteName, fn){

         let query = squel
             .select('COUNT(*) as count')
             .from('votes')
             .field("COUNT(*)", "count")
             .where(`theme_id = ${themeId} AND option_id IN ?`, 
                 squel
                 .select('id')
                 .field('id')
                 .from('options')
                 .where(`name = '${voteName}'`)
             ).toString();

        connection.query(query, fn);
    }    

    this.setVote = function(themeId, optionId, fn){
        let query = squel
            .insert()
            .into('votes')
            .set("theme_id", parseInt(themeId))
            .set("option_id", parseInt(optionId))
            .toString();

        connection.query(query, fn);
    }

}

const model = new Model();

module.exports = model;