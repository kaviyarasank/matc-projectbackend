const express = require("express");
const App = express();
const jwt = require("jsonwebtoken");
const Port = 8080;
App.use(express.json());
const cors = require("cors");
const fs = require('fs');
const value = require("./db.json")

App.listen(Port, () => {
  console.log(`COOL Your App is Runnig GOOD ${Port}`);
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
App.use(cors(corsOptions));
App.get("/",(req, res) => {
  res.send(value);
});

App.post("/checkAuth", (req,res)=>{
 checkAuth(req,res)
})

App.post("/register",(req,res)=>{
  const datas = value
  datas.find(element => {
    console.log("dbemail-->",element.email);

  let valdata = datas?.find((data)=>{
    return data.email === req.body.email
  })  
  console.log("valdata",valdata)
if(valdata !== undefined){
  res.status(400).json({
    error:"User Already found"
  });
}else{
  const data =datas.concat(req.body);
  console.log("bodysEmail",req.body.email)
  fs.writeFileSync('db.json',JSON.stringify(data));
}
  });
})

App.post("/login", (req, res) => {
  const {email} = req.body
  if (!req.body.email) {
    res.status(400).json({
      status: "falid to login user",
      error: { msg: "User not found" },
    });
  }
  const Token = jwt.sign({ email }, "hdhdhdhd", { expiresIn: "10m" });
  const refreshToken = jwt.sign({ email }, "hdhdhdhd", { expiresIn: "1h" });
  console.log(Token, "get login token");
  res.status(200).json({
    status:"success",
    Token,
    refreshToken,
  });
});
//Refresh
App.post("/refresh", (req, res) => {
  console.log("refresh",req)
  const refreshToken = req.headers["x-access-token"];
  let decode = jwt.decode(refreshToken);
  console.log("hai",decode)
  let curentMail = decode?.email;
  // let Mail = Data.find((user) =>user.Email);
  console.log(curentMail, "curr");
  if (curentMail) {
    const Token = jwt.sign({ curentMail }, "hdhdhdhd", { expiresIn: "25m" });
    return res.status(200).json({
      status: {
        Msg: "Your goto agin Sign In",
        Token,
        refreshToken,
      },
    });
  }
});

const checkAuth = (req, res, next) => {
  console.log("i am in check auth")
  const  {TokenExpiredError } = jwt;
  const catchError = (error, res) => {
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .send({ Message: "Unauthorized! AccessToken was expired!" });
    }
    return res.status(401).send({ message: "Unauthorized!" });
  };
  const token = req.headers["x-access-token"];
  console.log("reeeeee",token)

  if (!token) {
    res.status(400).json({
      errors: [{ msg: " Token is not Found" }]
    });
  }
  jwt.verify(token, "hdhdhdhd", (error,decoded) => {
    console.log("decoces",decoded)
    if (error) {
      return catchError(error, res);
    }
    // next();
  });
};

//Get User


