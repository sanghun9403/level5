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
      res.status(201).json({
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
      res.status(201).json({
        message: "로그인에 성공했습니다.",
      });
  };

  switch = async (req, res) => {
    const { user_id } = req.params;
    const switchUserAccount = await this.userService.switchUser(user_id, res);

    if (switchUserAccount.errorMessage) {
      return res.status(switchUserAccount.code).json({
        errorMessage: switchUserAccount.errorMessage,
      });
    } else {
      res.status(200).json({
        message: `${switchUserAccount.nickname} Account로 전환되었습니다.`,
      });
    }
  };

  logout = async (req, res) => {
    const { user_id } = req.params;
    const user = res.locals.user;
    const logout = await this.userService.logout(user_id);

    if (logout.errorMessage) {
      return res.status(logout.code).json({
        errorMessage: logout.errorMessage,
      });
    } else {
      res.status(200).json({
        message: `${user.nickname}님 로그아웃 되었습니다.`,
      });
    }
  };
}

module.exports = UserController;
