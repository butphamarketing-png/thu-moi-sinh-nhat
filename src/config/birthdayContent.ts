export type Celebrant = {
  id: "kim-tien" | "phuong-uyen";
  name: string;
  image: string;
  alt: string;
  objectPosition: string;
};

export type ProgramItem = {
  id: string;
  title: string;
  description: string;
  /** Để chuỗi rỗng nếu chưa chốt giờ. Không tự điền giờ giả. */
  time: string;
  icon: "cheers" | "cake" | "utensils" | "music";
};

/**
 * Nội dung thư mời. Sửa ngày, giờ, địa điểm tại `event`.
 * Chuỗi rỗng sẽ hiện placeholder và không được đọc thành tiếng.
 * Giờ 18:00 và 19:00 lấy từ ảnh thư mời đã gửi; xóa nếu chưa chốt.
 */
export const birthdayContent = {
  celebrants: [
    {
      id: "kim-tien",
      name: "Lê Thị Kim Tiền",
      image: "/images/kim-tien.jpg",
      alt: "Ảnh chân dung Lê Thị Kim Tiền",
      objectPosition: "center 22%",
    },
    {
      id: "phuong-uyen",
      name: "Phương Uyên",
      image: "/images/phuong-uyen.jpg",
      alt: "Ảnh chân dung Phương Uyên",
      objectPosition: "center 32%",
    },
  ] satisfies Celebrant[],
  invitation:
    "Rất hân hạnh được đón tiếp Quý anh/chị, bạn bè thân thiết tới chung vui cùng chúng mình trong ngày sinh nhật đặc biệt này!",
  thanks: "Rất mong nhận được sự hiện diện của Quý anh/chị và các bạn!",
  event: {
    date: "",
    time: "",
    venue: "",
    address: "",
  },
  placeholders: {
    date: "[Bổ sung ngày tổ chức]",
    time: "[Bổ sung giờ tổ chức]",
    venue: "[Bổ sung địa điểm]",
    address: "[Bổ sung địa chỉ]",
  },
  dressCode: "TRẮNG – ĐEN",
  program: [
    {
      id: "welcome",
      title: "Đón khách và giao lưu",
      description: "Chào đón và gặp gỡ những người thân yêu.",
      time: "18:00",
      icon: "cheers",
    },
    {
      id: "party",
      title: "Tiệc sinh nhật và chụp hình kỷ niệm",
      description: "Cùng thổi nến, cắt bánh và lưu lại khoảnh khắc.",
      time: "19:00",
      icon: "cake",
    },
    {
      id: "dinner",
      title: "Dùng tiệc thân mật",
      description: "Thưởng thức bữa tiệc ấm cúng bên nhau.",
      time: "",
      icon: "utensils",
    },
    {
      id: "show",
      title: "Giao lưu văn nghệ và các hoạt động thú vị",
      description: "Những tiết mục và hoạt động bất ngờ trong buổi tối.",
      time: "",
      icon: "music",
    },
  ] satisfies ProgramItem[],
  rsvpEnabled: true,
};

export type BirthdayContent = typeof birthdayContent;
