const onPasswordReset = ({ email, userModel }, req, res) => {
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
        "buttocs@buttsy.com",
        email,
        `Password reset butt is here! please click this link to reset your password http://${config.server.host}:${config.server.port}/auth/forgot-password-confirm?token=${user.resetPasswordToken}&email=${email}`
      );
      res.status(200).send("User password has been reset");
    });
  });
};

module.exports = onPasswordReset;
