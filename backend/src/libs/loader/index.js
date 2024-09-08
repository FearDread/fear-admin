const express = require("express");
const glob = require("fast-glob");
const fs = require("fs");
const path = require("path");

module.exports._loadRoutes = ( pattern ) => {
    let router = express.Router();
    const dir = path.join( __dirname, '..');
  
    glob(pattern, { cwd: dir })
        .then((files) => {
  
          for (const file of files) {
            if (fs.statSync(file).isFile() && path.extname(file).toLowerCase() === '.js') {
              try {
                
                const routeModule = require(path.resolve(file));
                router = (routeModule)(router);
                //router = (routeModule.default || routeModule)(router);
              
              } catch (e) {
                throw new Error(`Error when loading route file: ${file} [ ${e.toString()} ]`);
              }
            }
          }
          return router;
        })
        .catch((error) => {
          console.error("Glob Error :: ", error);
        });
  
    return router;
}