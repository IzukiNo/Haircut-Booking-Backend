# Haircut Booking - Backend

## Tổng quan

Đây là Backend cho một ứng dụng đặt lịch cắt tóc toàn diện. Dự án cung cấp một bộ APIs mạnh mẽ để quản lý người dùng, lịch hẹn, chi nhánh, dịch vụ, và nhiều hơn nữa. Được xây dựng với Node.js và Express, nó được thiết kế để có thể mở rộng và dễ dàng bảo trì.

## Tính năng chính

* **Xác thực người dùng (User Authentication):** Chức năng đăng ký và đăng nhập người dùng an toàn sử dụng JWT.
* **Kiểm soát truy cập dựa trên vai trò (Role-Based Access Control):** Phân quyền riêng biệt cho người dùng (users), thợ cắt tóc (stylists), thu ngân (cashiers), nhân viên (staff), và quản trị viên (admins).
* **Quản lý lịch hẹn (Appointment Management):** Tạo, hủy, và quản lý lịch hẹn cắt tóc với các trạng thái khác nhau (chờ xử lý, đã xác nhận, đã hủy, đã hoàn thành).
* **Quản lý chi nhánh (Branch Handling):** Quản lý nhiều chi nhánh với các thông tin chi tiết như tên, địa chỉ, số điện thoại, và quản lý.
* **Quản lý dịch vụ (Service Management):** Xác định và quản lý các dịch vụ cắt tóc khác nhau với mô tả, giá cả, và tình trạng sẵn có.
* **Quản lý thợ cắt tóc và nhân viên (Stylist and Staff Management):** Quản lý thợ cắt tóc và nhân viên, bao gồm lịch làm việc và chi nhánh được chỉ định.
* **Hệ thống đánh giá (Review System):** Cho phép người dùng gửi đánh giá và xếp hạng cho các lịch hẹn đã hoàn thành.
* **Quản lý thu ngân và giao dịch (Cashier and Transaction Management):** Chức năng cho thu ngân xử lý các giao dịch. (Transaction Management soon...)

## Công nghệ sử dụng (Tech Stack)

| Hạng mục      | Công nghệ                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)                                                                                                                                          |
| **Database** | [MongoDB](https://www.mongodb.com/)                                                                                                                                  |
| **Auth** | [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)                                                                                                                       |
| **API Tools** | [CORS](https://www.npmjs.com/package/cors), [Morgan](https://www.npmjs.com/package/morgan)                                                                                                                    |
| **Dev Tools** | [Nodemon](https://nodemon.io/), [dotenv](https://www.npmjs.com/package/dotenv)                                                                                                                               |

## Yêu cầu cài đặt

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:

* **Node.js:** (khuyên dùng phiên bản v16 trở lên) - [https://nodejs.org/](https://nodejs.org/)
* **npm:** (Node Package Manager) - Thường được cài đặt cùng với Node.js.
* **MongoDB:** Đảm bảo bạn có một instance MongoDB đang chạy hoặc có thể truy cập được. Bạn có thể sử dụng MongoDB Atlas (dựa trên đám mây) hoặc cài đặt cục bộ. - [https://www.mongodb.com/](https://www.mongodb.com/)

## Cài đặt & Thiết lập (Installation & Setup)

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/IzukiNo/Haircut-Booking-Backend.git
    cd Haircut-Booking-Backend
    ```

2.  **Cài đặt các dependencies:**

    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường:**

    * Tạo một tệp `.env` trong thư mục gốc của dự án.
    * Thêm các biến môi trường sau vào tệp `.env`:

        ```
        PORT=3000
        MONGO_URL=<Your MongoDB Connection URL>
        JWT_SECRET=<Your Secret Key for JWT>
        ```

        Thay thế `<Your MongoDB Connection URI>` bằng chuỗi kết nối đến cơ sở dữ liệu MongoDB của bạn.
        Thay thế `<Your Secret Key for JWT>` bằng một khóa bí mật được tạo ngẫu nhiên và an toàn.

4.  **Chạy ứng dụng:**

    Để chạy Server trong môi trường Develop (Nodemon + Morgan):

    ```bash
    npm run dev
    ```

    Để chạy Server trong môi trường Production:

    ```bash
    npm start
    ```

    Máy chủ sẽ bắt đầu chạy trên `http://localhost:3000` (hoặc cổng bạn đã chỉ định trong tệp `.env`).

## API Endpoints

Đây là tổng quan cấp cao về các API routes có sẵn:

* **Authentication:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
* **Users:** `/api/users/me`
* **Appointments:** `/api/appointments`
* **Reviews:** `/api/reviews`
* **Branches:** `/api/branches`
* **Services:** `/api/services`
* **Stylists:** `/api/stylists`
* **Staff:** `/api/staffs`
* **Cashiers:** `/api/cashiers`

Để biết thông tin chi tiết về từng endpoint, vui lòng tham khảo các định nghĩa route trong thư mục `routes/`.

## Cấu hình (Configuration)

* **`PORT`:** Cổng mà máy chủ lắng nghe (mặc định: 3000). Được cấu hình trong tệp `.env`.
* **`MONGO_URL`:** Chuỗi kết nối đến cơ sở dữ liệu MongoDB. Được cấu hình trong tệp `.env`.
* **`JWT_SECRET`:** Khóa bí mật được sử dụng để ký JSON Web Tokens (JWTs). Được cấu hình trong tệp `.env`. Đây phải là một chuỗi mạnh, được tạo ngẫu nhiên.

## Giấy phép (License)

Dự án này được cấp phép theo Giấy phép ISC. Xem tệp [package.json](package.json) để biết chi tiết.
