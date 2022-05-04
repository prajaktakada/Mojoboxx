const empModel = require("../Model/employeeModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

//POST /register

const createemp = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
        }

        //extract params
        let {name,age,email,password,department} = requestBody;

           //validation starts
         if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid name' })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }
         email = email.trim();
        const isEmailAlreadyUsed = await empModel.findOne({email:email}); // {email: email} object shorthand property

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }
         if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid password' })
        }
        
        if (!isValid(department)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }

        const userData = {name,age,email,password,department}

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        userData.password = await bcrypt.hash(userData.password, salt);

        let saveduser = await empModel.create(userData)
        res.status(201).send({ status: true, data: saveduser })
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}


// login
const login = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'value in request body is required' })
            return
        }

        let email = req.body.email
        let password = req.body.password

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'password must be present' })
            return
        }

        if (email && password) {

            let User = await empModel.findOne({ email:email })

                const passvalid = await bcrypt.compare(password,User.password)
                const Token = jwt.sign({
                    userId: User._id,
                }, "pk")
                res.header('x-api-key', Token)

                res.status(200).send({ status: true, msg: "User login successfull", data: { userId: User._id, Token: Token } })
            } else {
                res.status(400).send({ status: false, Msg: "Invalid Credentials" })
            }  
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



//GET /emp/:id
const emp = async function (req, res) {
    try {
        let decodedtokenUserId = req.user
        const empId = req.params.id
// console.log(decodedtokenUserId.userId)
// console.log(userId)

        if (!(isValid(empId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid empId' })
        }
 
        const searchempId = await empModel.findOne({_id:empId })
        // console.log(searchUserId)
        if (!searchempId) {
            return res.status(404).send({ status: false, message: 'empId does not exist' })
        }

        //console.log(decodedtokenUserId.userId === userId)
        if (!(decodedtokenUserId.userId === empId)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }
        
        res.status(200).send({ status: true, message: "empdoc", data: searchempId })
    } catch (error) {

        return res.status(500).send({ success: false, error: error.message });
    }
}



//PUT /updateemp/:id
const updateemp = async function (req, res) {
    try {
        const requestbody= req.body
        //const profileImage = req.files
        let decodedUserToken = req.user;

        if (!isValidRequestBody(requestbody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. Book unmodified' })
        }
        
        let empId = await empModel.findOne({ _id: req.params.id });
        
        if (!empId) {
            return res.status(404).send({ status: false, message: `User not found with given taskId` })
        }

    
        console.log(decodedUserToken.userId == empId._id)
        if (!(decodedUserToken.userId == empId._id)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }
      


         let {name,age,email,password,department} = requestbody;

           //validation starts
           if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid name' })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }
         email = email.trim();
        const isEmailAlreadyUsed = await empModel.findOne({email:email}); // {email: email} object shorthand property

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }
         if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid password' })
        }
        
        if (!isValid(department)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }

        const empData = {name,age,email,password,department}

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        empData.password = await bcrypt.hash(empData.password, salt);


        const upatedT= await empModel.findOneAndUpdate({_id:empId._id}, empData, { new: true })
          res.status(200).send({ status: true, message: 'updated successfully', data: upatedT });

            
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

const DeleteempbyQuery = async function (req, res) {
    try {
        // console.log(req.query.authorId)
        // console.log(req.user.userId)
        if (req.user.userId == req.query.empId) {
            let info = req.query
            let userbody = await empModel.findOne(info)
            let tempdata = await empModel.findOneAndUpdate({ id: userbody._id, isDeleted: false }, { isDeleted: true, deletedAt: Date() },{ new: true })
            if (tempdata) {

                res.status(200).send({status:true,data:tempdata})
            } else {
                res.status(404).send({ err: "data might have been already deleted" })
            }
        } else {
            res.status(404).send({ err: "you are trying to access a different's user account" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {createemp,login,emp,updateemp,DeleteempbyQuery}

