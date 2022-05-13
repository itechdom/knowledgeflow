// =================================================================
// Setup Auth ========================================
// ================================================================
const authService = require("@markab.io/node/passport-service/passport-service");
const {
  sendEmail
} = require("@markab.io/node/email-service/email-service");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const Auth = ({ config, userModel }) => {
  //on verify, we generate a jwt token (for non-web clients) and then we just store the user
  const onVerify = ({
    accessToken,
    refreshToken,
    profile,
    cb,
    providerName,
    username,
    password
  }) => {
    //add a jwt token for mobile based authentication
    //store the id for providers
    if (providerName === "local") {
      return userModel.findOne({ email: username }, function(err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (!user.verifyPassword(password)) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
    //third party providers
    let user = {};

    //keys to be saved
    let providerId = `${providerName}Id`;
    let providerProfile = `${providerName}Profile`;
    let providerAccessToken = `${providerName}AccessToken`;
    let providerRefreshToken = `${providerName}RefreshToken`;

    user["name"] = profile.displayName;
    user[providerId] = profile.id;
    user[providerAccessToken] = accessToken;
    user[providerRefreshToken] = refreshToken;
    user[providerProfile] = profile;

    let check = {};
    check[providerId] = profile.id;

    userModel.findOrCreate(check, user, function(err, user) {
      return cb(err, user);
    });
  };

  const onRegister = (values, req, res) => {
    let { password } = values;
    values.password = userModel.encryptPassword(password);
    let user = new userModel(values);
    if (userModel.joiValidate) {
      let { error } = userModel.joiValidate(user);
      if (error) {
        return res.status(409).send({
          message: `error validating your input ${error}`
        });
      }
    }
    let jwtToken = jwt.sign({ _id: user._id.toString() }, config.get("secret"));
    user.jwtToken = jwtToken;
    userModel.findOne({ email: user.email }, (err, foundUser) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (foundUser) {
        //found a user
        return res.status(409).send("User already exists");
      }
      sendEmail(
        "buttocs@buttsy.com",
        user.email,
        `you have a new butt! please click this link to verify your email http://${config.server.host}:${config.server.port}/auth/email-confirmation?token=${user.confirmEmailToken}&email=${user.email}`
      );
      return user.save(err => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send(user);
      });
    });
  };

  const onEmailVerify = ({ email, token }, req, res) => {
    userModel.findOne({ email, confirmEmailToken: token }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(409).send("User doesn't exist");
      }
      user.hasConfirmedEmail = true;
      return user.save(err => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send("User has been confirmed");
      });
    });
  };

  const onResendEmailConfirmation = (email, req, res) => {
    userModel.findOne({ email }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(409).send("User doesn't exist");
      }
      sendEmail(
        "buttocs@buttsy.com",
        email,
        `you have a new butt! please click this link to verify your email http://${config.server.host}:${config.server.port}/auth/email-confirmation?token=${user.confirmEmailToken}&email=${email}`
      );
    });
  };

  const onPasswordReset = ({ email }, req, res) => {
    userModel.findOne({ email }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(409).send("User doesn't exist");
      }
      user.resetPasswordToken = "reset";
      user.save(err => {
        if (err) {
          return res.status(500).send(err);
        }
        sendEmail(
          "noreplay@markab.io",
          email,
          `Password reset is here! please click this link to reset your password http://${config.server.host}:${config.server.port}/auth/forgot-password-confirm?token=${user.resetPasswordToken}&email=${email}`
        );
      });
    });
  };

  const onPasswordResetConfirm = ({ token, email }, req, res) => {
    let redirectUrl = `${config.get(
      "redirectUrl"
    )}/#/auth/reset-password?token=${token}&email=${email}`;
    return res.redirect(redirectUrl);
  };

  const onPasswordChange = ({ newPassword, token, email }, req, res) => {
    //change the password here
    userModel.findOne({ email, resetPasswordToken: token }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(409).send("User doesn't exist");
      }
      user.password = newPassword;
      return user.save(err => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send("User Password Have been Changed");
      });
    });
  };

  const onSuccess = (providerName, user, res) => {
    let jwtToken = jwt.sign({ _id: user._id.toString() }, config.get("secret"));
    userModel.update(
      { _id: user._id },
      { jwtToken },
      { multi: false },
      (err, user) => {
        if (err) {
          return console.error(err);
        }
      }
    );

    let redirectUrl = `${config.get("redirectUrl")}?jwt=${jwtToken}`;
    if (providerName !== "local") {
      return res.redirect(redirectUrl);
    }
    //delete password to prevent sending it back to the user
    user["password"] = "";
    return res.status(200).send(user);
  };

  const onLoginFail = (req, res, message) => {
    //in case the auth doesn't works
    res.status(401).send("Login Failed");
  };

  const authApi = authService({
    config,
    onVerify,
    onSuccess,
    onLoginFail,
    onRegister,
    onResendEmailConfirmation,
    onEmailVerify,
    onPasswordReset,
    onPasswordResetConfirm,
    onPasswordChange,
    passport
  });

  return authApi;
};

module.exports = Auth;
