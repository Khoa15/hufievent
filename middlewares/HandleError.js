exports.handleError = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    if(err.statusCode===500) err.message='Internal server error'
    if(err.code === 11000){
        err.statusCode = 400
        for(let p in err.keyValue){
            err.message = `${p} have to be unique`
        }
    }
    if(err.errors){
        console.log(err.errors)
        err.statusCode = 400
        err.message = []
        for(let p in err.errors){
            err.message.push(err.errors[p].properties.message)
        }
    }
    if(err.kind === "ObjectId"){
        err.statusCode = 404
        err.message = `The ${req.originalUrl} is not found`
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}