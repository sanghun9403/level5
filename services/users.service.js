const UserRepository = require("../repositories/users.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  userRepository = new UserRepository();

  findUser = async (email) => {
    const userData = await this.userRepository.findUserEmail(email);
    return userData;
  };

  createUser = async (email, nickname, password, confirmPassword) => {
    const userData = await this.userRepository.findAllUser(email, nickname);
    const regExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/);

    // 이메일 & 닉네임 중복 검사
    if (userData.length) {
      return { code: 412, errorMessage: "이메일 또는 닉네임이 이미 사용중입니다." };
    }

    // 닉네임 생성 조건 검사
    if (regExp.test(nickname)) {
      return {
        code: 412,
        errorMessage: "특수문자 및 공백이 사용불가합니다.",
      };
    }

    // 비밀번호 생성 조건 검사
    if (password.length <= 4 || password === nickname) {
      return {
        code: 412,
        errorMessage: "비밀번호는 최소 4자 이상이여야 하며, 닉네임과 같은 값이 포함될 수 없습니다.",
      };
    }

    if (password !== confirmPassword) {
      return { code: 412, errorMessage: "비밀번호가 일치하지 않습니다." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const createUserData = await this.userRepository.createUser(email, nickname, passwordHash);

    return {
      userId: createUserData.user_id,
      nickname: createUserData.nickname,
      email: createUserData.email,
    };
  };

  loginUser = async (email, password, res) => {
    const user = await this.userRepository.findUserEmail(email);

    if (!user) {
      return { code: 404, errorMessage: "등록된 유저 정보가 없습니다." };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { code: 412, errorMessage: "비밀번호가 일치하지 않습니다." };
    }

    try {
      const savedTokenUser = await this.userRepository.findToken(user.user_id);

      if (!savedTokenUser) {
        // 리프레시 토큰 생성
        const refreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        // 액세스 토큰 생성
        const accessToken = jwt.sign(
          { user_id: user.user_id, nickname: user.nickname },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "30s",
          }
        );
        await this.userRepository.saveRefreshToken(refreshToken, user.user_id);
        res.cookie("authorization", `Bearer ${accessToken}`);
        return { code: 200, message: "로그인에 성공하였습니다." };
      }
      try {
        // 토큰 만료검사
        jwt.verify(savedTokenUser.token_id, process.env.JWT_SECRET_KEY);

        // 삭제 후 재생성하여 생성날짜를 가장 최신으로 유지
        // accessToken이 만료되고 refreshToken만 있는 경우에 accessToken을 재발급하는 구조인데
        // refreshToken이 여러개가 있다보니 가장 위에 있는 tokenId가 나오는 것을 방지하기 위함
        // ex. 1번에서 3번으로 스위칭 후 엑세스토큰이 없는 상황을 가정했을 때 게시글 포스트 시 userId가 1번으로 등록되는 상황
        await this.userRepository.deleteUserToken(user.user_id);
        await this.userRepository.saveRefreshToken(savedTokenUser.token_id, user.user_id);

        const accessToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "30s",
        });
        res.cookie("authorization", `Bearer ${accessToken}`);
        return { code: 200, message: "로그인에 성공하였습니다." };
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          const refreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
          const accessToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "30s",
          });
          await this.userRepository.deleteUserToken(user.user_id);
          await this.userRepository.saveRefreshToken(refreshToken, user.user_id);
          res.cookie("authorization", `Bearer ${accessToken}`);
          return { code: 200, message: "로그인에 성공하였습니다." };
        } else {
          console.error(err);
          return { code: 400, errorMessage: "로그인에 실패하였습니다." };
        }
      }
    } catch (err) {
      return { code: 404, errorMessage: "존재하지 않는 아이디 또는 잘못된 접근입니다." };
    }
  };

  switchUser = async (user_id, res) => {
    const user = await this.userRepository.findUserId(user_id);
    const switchUserAccount = await this.userRepository.findToken(user_id);
    if (!switchUserAccount) {
      return { code: 404, errorMessage: "존재하지 않는 사용자입니다." };
    } else {
      jwt.verify(switchUserAccount.token_id, process.env.JWT_SECRET_KEY);

      await this.userRepository.deleteUserToken(switchUserAccount.user_id);
      await this.userRepository.saveRefreshToken(
        switchUserAccount.token_id,
        switchUserAccount.user_id
      );

      const accessToken = jwt.sign(
        { user_id: switchUserAccount.user_id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30s",
        }
      );
      res.cookie("authorization", `Bearer ${accessToken}`);
    }
    return { switchUserAccount, nickname: user.nickname };
  };

  logout = async (user_id) => {
    await this.userRepository.deleteUserToken(user_id);
  };
}

module.exports = UserService;
