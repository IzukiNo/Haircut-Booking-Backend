try {
    const { username, email, password, confirmPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin"
      });
    }

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu xác nhận không khớp"
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