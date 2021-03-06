/**
 *
 */

var bodyParser = require("body-parser");
var response = require("./response.js");
var verification = require("./verification.js");
var wechatHandler = require("../handler/wechat.js");

/**
 * Process the requirement
 */
function process(req, res) {
    
    //Try get the handler
    try {
        
        //Get the handler specified from the request
        var handler = require("../handler/" + req.params[0] + ".js");
        
        //Check if the request contains the request action
        if (req.query["action"]) {
            
            //Check if the handler has the action
            if (typeof handler[req.query["action"]] === "function") {
                
                //Try execute the request
                try {
                    
                    //Call the handler
                    handler[req.query["action"]](req, res);
                }
                catch (ex) {
                    
                    //Log the error
                    console.log(ex);
                    res.error(417, "Expectation Failed");
                }
            }
            else {
                res.error(404, "Action " + req.query["action"] + " Not Found");
            }
        }
        else {
            res.error(404, "No Action Specified");
        }
    }
    catch (err) {
        
        if (err.code === "MODULE_NOT_FOUND") {
            
            //If the module has not been found
            console.log(err);
            res.error(404, "Handler " + req.params[0] + " Not Found");
        }
        else {
            console.log(err);
            res.error(500, "Internal Server Error");
        }
    }
}

/**
 * The settlement of ajax processing for the given server
 */
exports.set = function (server) {
    
    //First handle all wechat request
    server.use("/ajax/wechat", wechatHandler.process);
    server.get("/ajax/wechat", wechatHandler.get);
    server.post("/ajax/wechat", wechatHandler.post);
    
    //Using Response and parser Middleware
    server.use(response);
    server.use(bodyParser.urlencoded({extended: false, limit: "10mb"}));
    server.use(bodyParser.json({limit: "10mb"}));
    
    //Pass all the requests to process function
    server.get("/ajax/*", process);
    server.post("/ajax/*", process);
}
