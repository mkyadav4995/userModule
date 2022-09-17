exports.login = async (req,h) => {
    try{
        const { email, password }= req.payload;
        let user = await Models.User.findOne({ where: { email } });
        console.log({user})
        if(user){
            if (!user.status) {
                return h.response({ success: false, message: req.i18n.__("USER_DEACTIVATED_BY_ADMIN"), responseData: {} }).code(400);
            } 
            else {
                let passwordVerification = Bcrypt.compareSync(password, user.password);
                if (passwordVerification) {
                    delete user.dataValues.password

                    const tokenData = { User: user, Role: user.Role, Permissions: [user.role] };
                    let token = Common.signToken(tokenData);
                    user.dataValues.token = token
                    responseData = user

                    return h.response({ success: true, message: req.i18n.__("AUTHORIZATION_VALIDATED_SUCCESSFULLY"), responseData: responseData }).code(200);
                } else {
                    return h.response({ success: false, message: req.i18n.__("INVALID_EMAIL_OR_PASSWORD"), responseData: {} }).code(400);
                }
            }
        }
        else{
            return h.response({ success: false, message: req.i18n.__("USER_DOES_NOT_EXISTS"), responseData: {} }).code(400);
        }
        
    } catch(err) {
        console.log(err)
        Logger.error(err);
        if (err.name === 'Error') {
            return h.response({ message: req.i18n.__('INVALID_USERNAME_OR_PASSWORD'), responseData:{} }).code(400);
        } 
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }

}

exports.addUser = async (req, h) => {
    try {
        const {name,  email, password, phoneNumber } = req.payload;

        const emailExists = await Models.User.findOne({ where: { email  } });
        if (emailExists) {
            return h.response({ success: false, message: req.i18n.__('EMAIL_ALREADY_TAKEN'), responseData: {} }).code(400);
        }
        let uniqueId = uuid.v4()	

        const rounds = parseInt(process.env.HASH_ROUNDS);
        let userPassword = Bcrypt.hashSync(password, rounds);
        console.log({userPassword})
        const createdUser = await Models.User.create({
            uuid : uniqueId, name, email, phoneNumber, password: userPassword, role : 'user', status : 1
        });

        return h.response({ success: true, message: req.i18n.__("USER_CREATED_SUCCESSFULLY"), responseData: { createdUser } }).code(201);
    } catch (error) {
        Logger.error(err);
        console.log(error);
        return h.response({ success: false, message: req.i18n.__('SOMETHING_WENT_WRONG'), responseData: {} }).code(500);
    }
}

exports.getUsers = async (req,h) => {
    try {
        let payload = req.query; 
        const authToken = req.auth.credentials.userData;
        let where = {
            status : 1,
            id:{
                [Op.ne] : authToken.User.id
            }
        }

        if(payload.name){
            where.name = {
                [Op.like] : `%${payload.name}%`
            }
        }
        if(payload.phoneNumber){
            where.phoneNumber = {
                [Op.like] : `%${payload.phoneNumber}%`
            }
        }
        
        const data = await Models.User.findAll({
            attributes: ['id','name','uuid','email','phoneNumber','status'],
            where 
        }) 
        return h.response({success:true,message:req.i18n.__("SUCCESSFULLY"),responseData:data}).code(200);
    } catch(error) {
        Logger.error(err);
        console.log(error);
        return h.response({success:false,message:req.i18n.__("SOMETHING_WENT_WRONG"),responseData:{}}).code(500);
    }
}

exports.updateUser = async (req, h) => {
    try {
        const {name, email, phoneNumber, status, id } = req.payload;
        let dataToUpdate = {}

        if(name){
            dataToUpdate.name=name
        }

        if(phoneNumber){
            const phoneExists = await Models.User.findOne({ 
                where:{ 
                    phoneNumber,
                    status : 1,
                    id: {
                        [Op.ne] : id
                    }  
                } 
            });
            if (phoneExists) {
                return h.response({ success: false, message: req.i18n.__('PHONE_ALREADY_TAKEN'), responseData: {} }).code(400);
            }
            dataToUpdate.phoneNumber=phoneNumber
        }

        if(email){
            const emailExists = await Models.User.findOne({ 
                where:{ 
                    email,
                    status : 1,
                    id: {
                        [Op.ne] : id
                    }  
                } 
            });
            if (emailExists) {
                return h.response({ success: false, message: req.i18n.__('EMAIL_ALREADY_TAKEN'), responseData: {} }).code(400);
            }
            dataToUpdate.email=email
        }

        if(status == 0 || status == 1){
            dataToUpdate.status=status
        }

        console.log({dataToUpdate})
        const createdUser = await Models.User.update(dataToUpdate,{
            where:{
                id
            }
        });

        return h.response({ success: true, message: req.i18n.__("USER_UPDATED_SUCCESSFULLY"), responseData: { createdUser } }).code(201);
    } catch (error) {
        Logger.error(err);
        console.log(error);
        return h.response({ success: false, message: req.i18n.__('SOMETHING_WENT_WRONG'), responseData: {} }).code(500);
    }
}

exports.updateUserStatus = async (req, h) => {
    try {
        const { id } = req.payload;

        await Models.User.update({
            status : 2
        },{
            where: {
                id
            }
        })

        return h.response({ success: true, message: req.i18n.__("USER_STATUS_UPDATED_SUCCESSFULLY"), responseData: {} }).code(201);
    } catch (error) {
        Logger.error(err);
        console.log(error);
        return h.response({ success: false, message: req.i18n.__('SOMETHING_WENT_WRONG'), responseData: {} }).code(500);
    }
}


