module.exports = {
    //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   //below mine
   UUID: function() {
       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
           var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
           return v.toString(16);
       });
   },
 
   //mine
   //depreaced is not quit good
   oldUUID: function() {
       let text = ""
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
     
       for (var i = 0; i < 10; i++) {
         text += possible.charAt( Math.floor( Math.random() * possible.length ))
       }
     
       return text;
   }
};