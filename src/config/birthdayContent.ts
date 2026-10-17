export type Celebrant = {
  id: "kim-tien" | "phuong-uyen";
  name: string;
  born: string;
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
 * Ngày 22/10, giờ 19:30 và Gigamall Thủ Đức lấy từ thiệp mới.
 */
export const birthdayContent = {
  celebrants: [
    {
      id: "kim-tien",
      name: "Lê Thị Kim Tiền",
      born: "26.10.2003",
      image: "/images/kim-tien.jpg",
      alt: "Ảnh chân dung Lê Thị Kim Tiền",
      objectPosition: "center 22%",
    },
    {
      id: "phuong-uyen",
      name: "Lê Thị Phương Uyên",
      born: "29.10.2004",
      image: "/images/phuong-uyen.jpg",
      alt: "Ảnh chân dung Lê Thị Phương Uyên",
      objectPosition: "center 32%",
    },
  ] satisfies Celebrant[],
  invitation:
    "Rất hân hạnh được đón tiếp Quý anh/chị, bạn bè thân thiết tới chung vui cùng chúng mình trong ngày sinh nhật đặc biệt này!",
  thanks: "Rất mong nhận được sự hiện diện của Quý anh/chị và các bạn!",
  event: {
    date: "22/10",
    time: "19:30",
    venue: "Gigamall",
    address: "Thủ Đức",
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
      time: "",
      icon: "cheers",
    },
    {
      id: "party",
      title: "Tiệc sinh nhật và chụp hình kỷ niệm",
      description: "Cùng thổi nến, cắt bánh và lưu lại khoảnh khắc.",
      time: "",
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
