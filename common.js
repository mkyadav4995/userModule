exports.privateKey=process.env.PRIVATE_KEY
exports.algorithm=process.env.ALGORITHM
exports.iv=process.env.IV

decrypt = (text) => {
  let decipher = crypto.createDecipheriv(this.algorithm, this.privateKey, this.iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted = decrypted + decipher.final("utf8");
  return decrypted;
}

encrypt = (text) => {
  let cipher = crypto.createCipheriv(this.algorithm,this.privateKey, this.iv);
  let encrypted =cipher.update(text, "utf8", "hex");
  encrypted = encrypted + cipher.final("hex");
  return encrypted;
}

const getTokenStatus = async (userId) => {
	let data = await Models.User.findOne(
		{ where: {id : userId } }
	);
	return data;
};

exports.prefunction = (req,h) => {
  global.LanguageCodes = process.env.ALL_LANGUAGE_CODE.split(',');
  global.LanguageIds = process.env.ALL_LANGUAGE_ID.split(',').map(function(item) {
    return parseInt(item, 10);
  });
  global.utcOffset = req.headers.utcoffset;
  return true;
}

exports.routeError = (errors,message) => {
  console.log(errors);
  errors.forEach(err=>{ 
  switch(err.code){
    case "any.required":
      err.message=message;
      break
      }
    });
    return errors
}

exports.axiosCacheRequest = async (requestUrl,requestMethod,requestHeader,requestBody) => {
  let responseData;
  requestHeader={...requestHeader,'Api-Key':process.env.MYFOJO_API_KEY}
  try {
    let requestObject = {
      url: requestUrl,
      method: requestMethod.toLowerCase(),
      headers: requestHeader,
    }
    requestObject = (requestMethod.toLowerCase() === 'get') ? {...requestObject,params:requestBody} : {...requestObject,data:requestBody}
    console.log(requestObject);

    let requestHash = encrypt(JSON.stringify(requestObject))
    const cacheExists = await Models.Cache.findOne({where:{requestHash}})
    if(cacheExists) {
      responseData = JSON.parse(cacheExists.response);
    } else {
      responseData = await Axios(requestObject);
      responseData = responseData.data;
      stringifiedResponse = JSON.stringify(responseData)
      await Models.Cache.create({requestUrl,requestMethod,requestHeader,requestBody,requestHash,response:stringifiedResponse})
    }
  } catch({response}) {
    return response ? response.data : 'AXIOS_REQUEST_FAILED'
  }
  return responseData
}

exports.formatListingWithPagination = async (record,recordLimit) => {
  return {
    data: record.rows,
    perPage: recordLimit,
    totalRecords: record.count,
    baseUrl: process.env.NODE_SERVER_PUBLIC_API,
    totalPages: Math.ceil(record.count / recordLimit),
  }
}

exports.validateToken = async (token) => {
  fetchToken = JSON.parse(decrypt(token.data));
  var diff = Moment().diff(Moment(token.iat * 1000));
  if (diff > 0) {
    return {
      isValid: true,
      credentials: { userData: fetchToken, scope: fetchToken.Permissions }
    }; 
  }
  return {
    isValid: false
  };
};

exports.convertToUTC = (date,offset) => {
  console.log(date);
  let utcDate = Moment(date).utcOffset(offset, true);
  console.log(utcDate);
  return utcDate;
}

exports.signToken = (tokenData) => {
    return Jwt.sign(
      { data: encrypt(JSON.stringify(tokenData))},
      this.privateKey
    );
};

exports.headers = (authorized) => {
	let Globalheaders = {
        language: Joi.string().optional().default(process.env.DEFAULT_LANGUANGE_CODE),
        utcoffset: Joi.string().optional().default(0)
    };
	if (authorized){
        _.assign(Globalheaders, {authorization: Joi.string().required().description("Token to identify user who is performing the action")});
	}
	return Globalheaders;
};

exports.sendOTP = async (phoneNumber) => {
  return {phoneNumber:phoneNumber,pinId:process.env.MASTER_OTP}
}

exports.sendEmail = async (to,from,cc,bcc,subject,content,replacements,attachments,language,template) => {
  let protocol = process.env.EMAIL_PROTOCOL;
  switch(protocol){
    case 'smtp':
        let transporter = nodemailer.createTransport({
          host: Constants.SMTP.host,
          port: Constants.SMTP.port,
          secure: Constants.SMTP.ssl,
          auth: {
            user: Constants.SMTP.username,
            pass: Constants.SMTP.password
          }
        });
        console.log(__dirname);
        readHTMLFile(__dirname + "/emails/"+language+'/' + template + ".html", async function(
          err,
          html
        ) {
          let sendto=to.join(',');
          //let to='sachinkhanna@illuminz.com';
          var template = handlebars.compile(html);
          var mergeContent = template({content:content});
          var templateToSend = handlebars.compile(mergeContent);
          var htmlToSend = templateToSend(replacements);
          let mailOptions = {
            from: from, // sender address
            to: sendto, // list of receivers
            cc:cc.join(','),
            bcc:bcc.join(','),
            subject: subject, // Subject line
            text: striptags(htmlToSend), // plain text body
            html: htmlToSend, // html body
            attachments: attachments,
            priority: "high"
          };
          let info = await transporter.sendMail(mailOptions);
          return info;
        });
  }
  return;
}

exports.generateCode = (requestedlength) => {
  const char = '1234567890'; //Random Generate Every Time From This Given Char
  const length = typeof requestedlength !='undefined' ? requestedlength : 4;
  let randomvalue = '';
  for ( let i = 0; i < length; i++) {
    const value = Math.floor(Math.random() * char.length);
    randomvalue += char.substring(value, value + 1).toUpperCase();
  }
  return randomvalue;
}

exports.FailureError = (err,req) => {
  const updatedError = err;
	updatedError.output.payload.message = [];
	let customMessages = {};
	if (err.isJoi && Array.isArray(err.details) && err.details.length > 0){
		err.details.forEach((error) => {
			customMessages[error.context.label] = req.i18n.__(error.message);
		});
	}
	delete updatedError.output.payload.validation;
	updatedError.output.payload.error =  req.i18n.__('BAD_REQUEST');
  console.log('err.details.type', err.details)
  if(err.details[0].type === 'string.email') {
    updatedError.output.payload.message = req.i18n.__(
      "PLEASE_ENTER_A_VALID_EMAIL"
    );
  } else {
    updatedError.output.payload.message = req.i18n.__(
      "ERROR_WHILE_VALIDATING_REQUEST"
    );
  }
	updatedError.output.payload.errors = customMessages;
	return updatedError;
}

exports.generateError=(req,type,message,err)=>{
  switch(type){
      case 500:
          error = Boom.badImplementation(message);
          error.output.payload.error =  req.i18n.__('INTERNAL_SERVER_ERROR');
          error.output.payload.message =  req.i18n.__(message);
          error.output.payload.errors = err;
          console.log(err);
          break;
      case 400:
          error = Boom.badRequest(message);
          error.output.payload.error =  req.i18n.__('BAD_REQUEST');
          error.output.payload.message =  req.i18n.__(message);
          error.output.payload.errors = err;
          break;
      case 401:
        error = Boom.unauthorized(message);
        error.output.payload.error =  req.i18n.__('UNAUTHORIZED_REQUEST');
        error.output.payload.message =  req.i18n.__(message);
        error.output.payload.errors = err;
        break;
      case 403:
          error = Boom.forbidden(message);
          error.output.payload.error =  req.i18n.__('PERMISSION_DENIED');
          error.output.payload.message =  req.i18n.__(message);
          error.output.payload.errors = err;
          break;
      default: 
          error = Boom.badImplementation(message);
          error.output.payload.error =  req.i18n.__('UNKNOWN_ERROR_MESSAGE');
          error.output.payload.message =  req.i18n.__(message);
          error.output.payload.errors = err;
          break;
  }
  return error;
}

exports.getTotalPages = async (records, perpage) => {
  let totalPages = Math.ceil(records / perpage);
  return totalPages;
};