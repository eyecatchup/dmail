

function Encrypmail(content, key, callback)
{
   $.ajax({
       url: "https://encrypt.bygris.com/Api/mail",
       type: "POST",
       data: {content: content, hash: key},
       dataType: "JSON",
       success: function ( response, status )
       {
           console.log("Transport::EncryptMail::Success", response, status)
           callback(null,response); 
       },
       error: function(response, status, errorThrown ) {
           console.log("Transport::EncryptMail::Error", response, status)
           callback(null,errorThrown); 
       }
   });
   
}

function Savedetails(id, to, from, callback)
{
   $.ajax({
       url: "https://encrypt.bygris.com/Api/Savedata",
       type: "POST",
       data: {id: id, to: to,from:from},
       dataType: "JSON",
       success: function ( response, status )
       {
           console.log("Transport::Savecontact::Success", response, status)
           callback(null,response); 
       },
       error: function(response, status, errorThrown ) {
           console.log("Transport::Savecontact::Error", response, status)
           callback(null,errorThrown); 
       }
   });
   
}

function Checkaccess(id,userid,callback)
{
   $.ajax({
       url: "https://encrypt.bygris.com/Api/Check",
       type: "POST",
       data: {id: id, email:userid},
       dataType: "JSON",
       success: function ( response, status )
       {
           console.log("Transport::Checkaccess::Success", response, status)
           callback(null,response); 
       },
       error: function(response, status, errorThrown ) {
           console.log("Transport::Checkaccess::Error", response, status)
           callback(null,errorThrown); 
       }
   });
   
}


function retrieveData(id,callback)
{
   $.ajax({
       url: "https://encrypt.bygris.com/Api/value",
        type: "POST",
        data: {id: id},
        dataType: "JSON",
       success: function ( response, status )
       {
           console.log("Transport::retrieveData::Success", response, status)
           callback(null,response); 
       },
       error: function(response, status, errorThrown ) {
           console.log("Transport::retrieveData::Error", response, status)
           callback(null,errorThrown); 
       }
   });
   
}


function Revoke(id,email, callback)
{
   $.ajax({
       url: "https://encrypt.bygris.com/Api/revoke",
       type: "POST",
       data: {id: id, email: email},
       dataType: "JSON",
       success: function ( response, status )
       {
           console.log("Transport::Revoke::Success", response, status)
           callback(null,response); 
       },
       error: function(response, status, errorThrown ) {
           console.log("Transport::Revoke::Error", response, status)
           callback(null,errorThrown); 
       }
   });
   
}


