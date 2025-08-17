# Sybau Education - Admin User Management

## 🎯 Tổng quan

Giao diện quản lý admin cho hệ thống Sybau Education được xây dựng với React, shadcn/ui và TailwindCSS.

## ✨ Tính năng đã hoàn thành

### 📊 User Management Dashboard

- **Danh sách user**: Hiển thị tất cả user với thông tin chi tiết
- **Search & Filter**: Tìm kiếm theo tên/email, lọc theo role/status
- **Pagination**: Phân trang với điều hướng linh hoạt
- **Statistics Cards**: Thống kê tổng quan về user

### 👤 User Actions

- **Ban/Unban User**: Khóa/mở khóa tài khoản user
- **Edit User**: Chỉnh sửa thông tin user (tên, email)
- **Assign Roles**: Gán role cho user (Admin, Instructor, Student)
- **View Details**: Xem chi tiết thông tin user

### 📋 User Detail View

- **Personal Info**: Thông tin cá nhân, avatar, role, status
- **Courses Tab**: Danh sách khóa học đã enroll
- **Payments Tab**: Lịch sử thanh toán
- **Activity Logs Tab**: Nhật ký hoạt động

### 🎨 UI Components

- **Responsive Design**: Tương thích trên desktop/mobile
- **Dark/Light Mode**: Hỗ trợ theme (qua shadcn/ui)
- **Interactive Dialogs**: Xác nhận hành động
- **Loading States**: Trạng thái loading/error
- **Toast Notifications**: Thông báo hành động

## 🛠️ Công nghệ sử dụng

- **React 18** với TypeScript
- **shadcn/ui** components
- **TailwindCSS** styling
- **React Router** routing
- **Lucide React** icons

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── admin/
│   │   ├── UserTable.tsx       # Bảng danh sách user
│   │   ├── UserDetail.tsx      # Chi tiết user
│   │   ├── SearchBar.tsx       # Thanh tìm kiếm
│   │   ├── FilterBar.tsx       # Thanh lọc
│   │   ├── UserDialogs.tsx     # Các dialog actions
│   │   └── AdminLayout.tsx     # Layout admin
│   └── ui/                     # shadcn/ui components
├── pages/
│   └── admin/
│       └── users/
│           ├── UsersListPage.tsx    # Trang danh sách
│           └── UserDetailPage.tsx   # Trang chi tiết
├── types/
│   └── users/
│       └── index.ts           # TypeScript types
└── data/
    └── mockData.ts           # Mock data
```

## 🎮 Demo

- **URL**: http://localhost:5173/admin/users
- **Mock Data**: Sử dụng dữ liệu mẫu cho demo
- **Actions**: Tất cả actions đều hoạt động với mock data

## 🔄 Tính năng demo

1. **User List**: Xem danh sách 5 user mẫu
2. **Search**: Tìm kiếm theo "John", "jane@", etc.
3. **Filter**: Lọc theo Role (Admin/Instructor/Student)
4. **Actions**: Click actions để test dialogs
5. **User Detail**: Click vào user để xem chi tiết
6. **Responsive**: Test trên mobile/tablet

## 📝 Ghi chú

- Giao diện đã hoàn chỉnh về UI/UX
- Chưa kết nối API backend thật
- Sử dụng mock data để demo
- Sẵn sàng tích hợp API khi backend hoàn thành
