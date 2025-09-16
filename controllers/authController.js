const authService = require("../services/authService");

// Đăng ký người dùng mới
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin"
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    // Gọi service để đăng ký
    const result = await authService.registerUser({
      username,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    
    // Xử lý lỗi cụ thể
    if (error.message.includes("email") || error.message.includes("Email")) {
      return res.status(409).json({
        success: false,
        message: "Email đã tồn tại"
      });
    }
    
    if (error.message.includes("username") || error.message.includes("Username")) {
      return res.status(409).json({
        success: false,
        message: "Tên đăng nhập đã tồn tại"
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký"
    });
  }
}

// Đăng nhập người dùng
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp email và mật khẩu"
      });
    }

    // Gọi service để đăng nhập
    const result = await authService.loginUser(email, password);

    // Đặt cookie nếu cần (tùy chọn)
    if (result.token) {
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
      });
    }

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    
    // Xử lý lỗi cụ thể
    if (error.message.includes("not found") || error.message.includes("không tồn tại")) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại"
      });
    }
    
    if (error.message.includes("password") || error.message.includes("mật khẩu")) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không chính xác"
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập"
    });
  }
}

// Đăng xuất người dùng
async function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy token"
      });
    }

    // Gọi service để đăng xuất (có thể thêm token vào blacklist)
    await authService.logoutUser(token);

    // Xóa cookie
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công"
    });

  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng xuất"
    });
  }
}

module.exports = { register, login, logout };