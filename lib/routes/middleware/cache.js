//DEPENDENCIES
const client = require('../../db/redis/index');

//HINT FIRST ADD ALL THIS LOGIC INTO THE db-operations function itself
//THEN FIGURE OUT IF YOU CAN EXTRAPOLATE IT INTO MIDDLE WARE
//BECAUE YOU NEED TO SET THE RETURN RESULT IF THE CACHE DOESN"T EXIST

const cacheRegionRouteOps = {
  collectionKey: 'region',
  getRegionId : async function(req, res, next) {
    // const queryKey = `q::method::${req.method}::regionID::${req.path}`;
    // // console.log('THIS IS THE KEY');
    // // console.log(key);
    // // console.log("------------")
    //
    // const value = await client.hgetAsync(this.collectionKey, queryKey)
    // .catch(() => res.status(500).send('Internal server error'));
    // if (client.connected) {
    //   if (value !== undefined || value !== null) {
    //     console.log(JSON.parse(value))
    //   } else {
    //
    //   }
    // }




    //If it exists
      //send formatted json
    //If it doesn't exist
      //next
    next();

    // getRegion(req.params.id)
    // .then(region => res.status(200).json(region))
    // .catch(err => res.status(500).send(err))
  }
}

//Cache specific routes
  //Get regionid should be cached 100%
  //Get all vendors should be cached (as long as there is no query params)
    //Cached should be cleared everytime any vendor gets updated
  //Get vendor by id should be cached
//Clear cache

module.exports = {
  cacheRegionRouteOps
}
