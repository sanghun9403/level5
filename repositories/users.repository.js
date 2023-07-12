const { User, Token } = require("../models");
const { Op } = require("sequelize");

class UserRepository {
  createUser = async (email, nickname, password) => {
    const createUserData = await User.create({ email, nickname, password });
    return createUserData;
  };

  findAllUser = async (email, nickname) => {
    const findUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }, { nickname }],
      },
    });
    return findUsers;
  };

  findUserEmail = async (email) => {
    const findUserEmail = await User.findOne({
      where: { email },
    });
    return findUserEmail;
  };

  findUserId = async (user_id) => {
    const findUser = await User.findOne({
      where: { user_id },
    });
    return findUser;
  };

  findToken = async (user_id) => {
    const findToken = await Token.findOne({ where: { user_id } });
    return findToken;
  };

  saveRefreshToken = async (refreshToken, user_id) => {
    const saveToken = Token.create({ token_id: refreshToken, user_id });
    return saveToken;
  };

  deleteUserToken = async (user_id) => {
    await Token.destroy({
      where: { user_id },
    });
  };
}

module.exports = UserRepository;
