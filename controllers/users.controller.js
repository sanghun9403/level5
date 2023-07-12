const UserService = require("../services/users.service");

class UserController {
  userService = new UserService();

  signup = async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;
    const userData = await this.userService.createUser(email, nickname, password, confirmPassword);

    if (userData.errorMessage)
      return res.status(userData.code).json({
        errorMessage: userData.errorMessage,
      });
    else
      return res.status(201).json({
        data: userData,
        message: "회원가입이 완료되었습니다.",
      });
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const findUser = await this.userService.loginUser(email, password, res);

    if (findUser.errorMessage)
      return res.status(findUser.code).json({
        errorMessage: findUser.errorMessage,
      });
    else
      return res.status(201).json({
        message: "로그인에 성공했습니다.",
      });
  };

  switch = async (req, res) => {
    try {
      const { user_id } = req.params;
      const switchUserAccount = await this.userService.switchUser(user_id, res);

      return res.status(200).json({
        message: `${switchUserAccount.nickname} Account로 전환되었습니다.`,
      });
    } catch (err) {
      return res.status(400).json({
        errorMessage: err.message,
      });
    }
  };

  logout = async (req, res) => {
    try {
      const { user_id } = req.params;
      const user = res.locals.user;
      await this.userService.logout(user_id);

      return res.status(200).json({
        message: `${user.nickname}님 로그아웃 되었습니다.`,
      });
    } catch (err) {
      return res.status(400).json({
        errorMessage: err.message,
      });
    }
  };
}

module.exports = UserController;
