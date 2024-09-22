class APIError extends Error{
    constructor(
        statuscode,
        message="Something went wrong",
        errors=[],
        stack=''){
        super(message)
        this.statuscode=statuscode
        this.data=null // read documentation
        this.message=message
        this.success=false
        this.errors=errors

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }   
    }
}

export {APIError}