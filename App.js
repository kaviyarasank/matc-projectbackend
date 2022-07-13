const express = require("express");
const App = express();
const jwt = require("jsonwebtoken");
const Port = 8080;
App.use(express.json());
const cors = require("cors");
const fs = require("fs");
const value = require("./db.json");
const profile = require("./profile.json");
const product = require("./product.json");
const addProduct = require("./addToCart.json");
const pathname = require("./path.json");
const address = require("./address.json");

App.listen(Port, () => {
  console.log(`COOL Your App is Runnig GOOD ${Port}`);
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
App.use(cors(corsOptions));
App.get("/", (req, res) => {
  res.send(value);
});
App.get("/profileInfo", (req, res) => {
  res.send(profile);
});

App.get("/productInfo", (req, res) => {
  res.send(product);
});

App.get("/getCartInfo", (req, res) => {
  res.send(addProduct);
});

App.get("/pathName", (req, res) => {
  res.send(pathname);
});


App.get("/addressGet",(req,res)=>{
  res.send(address);
})
App.post("/checkAuth", (req, res) => {
  checkAuth(req, res);
});

App.post("/register", (req, res) => {
  const datas = value;
  datas.find((element) => {
    console.log("dbemail-->", element.email);

    let valdata = datas?.find((data) => {
      return data.email === req.body.email;
    });
    console.log("valdata", valdata);
    if (valdata !== undefined) {
      const status = 400;
      const message = "Email & Password already exist";
      res.status(status).json({ status, message });
      return;
    } else {
      const data = datas.concat(req.body);
      console.log("bodysEmail", req.body.email);
      fs.writeFileSync("db.json", JSON.stringify(data));
      const status = 200;
      const message = "Register Suucess";
      res.status(status).json({ status, message });
      return;
    }
  });
});


console.log("address",address.length)
App.post("/address", (req, res) => {

  if (address.length === 0) {
    fs.writeFileSync("address.json", JSON.stringify([req.body]));
    res.send(200);
  } else {
    fs.unlinkSync("address.json");
    fs.mkdir("/address.json", function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("Directory created successfully!");
    });
    fs.writeFileSync("address.json", JSON.stringify([req.body]));
    const status = 200;
    const message = "address removed and addedd success";
    res.status(status).json({ status, message });
    return;
  }
});


App.post("/profile", (req, res) => {
  let data = Object.values(profile)?.find(
    (val) => val.email === req.body.email
  );

  if (data === undefined) {
    let value = Object.values(profile)?.concat(req.body);
    fs.writeFileSync("profile.json", JSON.stringify(value));
    res.send(200);
  } else {
    const final = profile.filter((data) => data.email !== req.body.email);
    fs.unlinkSync("profile.json");

    const timer = setTimeout(() => {
      res.send(200);
      fs.mkdir("/profile.json", function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
      });

      let valdata = Object.values(final).concat(req.body);
      fs.writeFileSync("profile.json", JSON.stringify(valdata));
    }, 4000);

    return () => clearTimeout(timer);
  }
});

App.post("/postProduct", (req, res) => {
  if (product === undefined) {
    const dataProduct = product.concat(req.body);
    fs.writeFileSync("product.json", JSON.stringify(dataProduct));
    const status = 200;
    const message = "product Added Success";
    res.status(status).json({ status, message });
    return;
  } else {
    fs.unlinkSync("product.json");
    fs.mkdir("/product.json", function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("Directory created successfully!");
    });
    fs.writeFileSync("product.json", JSON.stringify(req.body));
    const status = 200;
    const message = "Product removed and addedd success";
    res.status(status).json({ status, message });
    return;
  }
});

App.post("/addToCart", (req, res) => {
  const { id, name, image, price_string, price_symbol, price } = req.body;
  let val = addProduct.find((data) => data.id === id);
  console.log("****req.body****", val);
  if (val !== undefined) {
    const status = 405;
    const message = "Already Added To the Cart";
    res.status(status).json({ status, message });
    return;
  } else {
    let data = addProduct.concat(req.body);
    fs.writeFileSync("addToCart.json", JSON.stringify(data));
    res.status(200).json(addProduct);
  }
});

App.post("/login", (req, res) => {
  const { email } = req.body;
  if (!req.body.email) {
    res.status(400).json({
      status: "falid to login user",
      error: { msg: "User not found" },
    });
  }
  const Token = jwt.sign({ email }, "hdhdhdhd", { expiresIn: "40m" });
  const refreshToken = jwt.sign({ email }, "hdhdhdhd", { expiresIn: "1h" });
  console.log(Token, "get login token");
  res.status(200).json({
    status: "LoginSuccess",
    Token,
    refreshToken,
  });
});

App.post("/path", (req, res) => {
  if (pathname === undefined) {
    const dataProduct = pathname.concat(req.body);
    fs.writeFileSync("path.json", dataProduct);
    const status = 200;
    const message = "pathname Added Success";
    res.status(status).json({ status, message });
    return;
  } else {
    fs.unlinkSync("path.json");
    const timer = setTimeout(() => {
      res.send(200);
      fs.mkdir("/path.json", function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
      });
      let cdata = [];
      let valdata = cdata.concat(req.body);
      fs.writeFileSync("path.json", JSON.stringify(valdata));
    }, 3000);
    return () => clearTimeout(timer);
  }
});

//Refresh
App.post("/refresh", (req, res) => {
  console.log("refresh", req);
  const refreshToken = req.headers["x-access-token"];
  let decode = jwt.decode(refreshToken);
  console.log("hai", decode);
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

const checkAuth = (req, res) => {
  console.log("i am in check auth");
  const { TokenExpiredError } = jwt;
  const catchError = (error, res) => {
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .send({ Message: "Unauthorized! AccessToken was expired!" });
    }
    return res.status(401).send({ message: "Unauthorized!" });
  };
  const token = req.headers["x-access-token"];
  console.log("reeeeee", req.headers["x-access-token"]);

  if (!token) {
    res.status(400).json({
      errors: [{ msg: " Token is not Found" }],
    });
  }
  jwt.verify(token, "hdhdhdhd", (error, decoded) => {
    console.log("decoces", decoded);
    if (error) {
      return catchError(error, res);
    }
    // next();
  });
};

//Get User
