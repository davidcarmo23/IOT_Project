function ValidateEmail(input) {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if (validRegex.test(input)) {
        return true
    }else{
        return false
    }
   
  }

  export default ValidateEmail;