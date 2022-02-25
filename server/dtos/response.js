exports.ResponseDTO = class{
  constructor(type, status, message, data=null){
    this.type=type
    this.status=status
    this.message=message
    this.data=data
  }
}