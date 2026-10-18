import type { StoryAction, StorySegment } from "../types/story";

/**
 * Lời dẫn và các mốc xuất hiện.
 * Đổi `text` rồi chạy `npm run generate:audio` để tạo lại giọng đọc.
 * `enabled: false` sẽ bỏ qua cả câu đọc lẫn hiệu ứng của phân đoạn đó.
 * `afterWord` bám theo từ trong audio. `atRatio` là tỷ lệ thời lượng thật của file.
 */
export const storySegments: StorySegment[] = [
  {
    id: "once",
    text: "Cách đây 23 năm về trước…",
    audioSrc: "/audio/01-once.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["memory-in"],
    onExit: ["memory-out"],
  },
  {
    id: "angels",
    text: "Vũ trụ đã gửi đến thế gian hai tiểu thiên thần đáng yêu…",
    audioSrc: "/audio/02-angels.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["angels-in"],
    onExit: [],
  },
  {
    id: "name-tien",
    text: "Một nàng mang tên Lê Thị Kim Tiền…",
    audioSrc: "/audio/03-name-tien.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["name-left"],
    onExit: [],
  },
  {
    id: "name-uyen",
    text: "Và một nàng mang tên Phương Uyên…",
    audioSrc: "/audio/04-name-uyen.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["name-right"],
    onExit: [],
  },
  {
    id: "personalities",
    text: "Hai cô gái, hai cá tính, hai câu chuyện khác nhau…",
    audioSrc: "/audio/05-personalities.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["frames-in"],
    onExit: [],
  },
  {
    id: "chapter",
    text: "Vậy mà hôm nay, cả hai lại cùng nhau viết nên một chương thật đặc biệt.",
    audioSrc: "/audio/06-chapter.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["together-in"],
    onExit: [],
  },
  {
    id: "joy",
    text: "Một ngày tràn ngập tiếng cười, những lời chúc yêu thương và những khoảnh khắc đáng nhớ…",
    audioSrc: "/audio/07-joy.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["joy-in"],
    onExit: [],
  },
  {
    id: "know",
    text: "Và bạn biết không?",
    audioSrc: "/audio/08-know.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["focus-in"],
    onExit: [],
  },
  {
    id: "waited",
    text: "Hai nàng công chúa đã chờ ngày này từ rất lâu…",
    audioSrc: "/audio/09-waited.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "meet",
    text: "Không chỉ để đón tuổi mới, mà còn để được gặp những người đặc biệt nhất của mình.",
    audioSrc: "/audio/10-meet.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "guest",
    text: "Và người đang đọc những dòng này… chính là một trong những vị khách đặc biệt ấy!",
    audioSrc: "/audio/11-guest.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["hero-in"],
    onExit: [],
  },
  {
    id: "remember",
    text: "Vậy thì hãy cùng ghi nhớ cuộc hẹn đặc biệt của chúng ta nhé!",
    audioSrc: "/audio/22-remember.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "clock",
    text: "Thời gian: 19 giờ 30 phút, ngày 22 tháng 10 năm 2026.",
    audioSrc: "/audio/23-clock.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["event-time"],
    onExit: [],
  },
  {
    id: "place",
    text: "Địa điểm: Gigamall, Thủ Đức.",
    audioSrc: "/audio/24-place.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["event-place"],
    onExit: [],
  },
  {
    id: "dress-code",
    text: "Dress code: trắng đen.",
    audioSrc: "/audio/25-dress-code.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["dress-label", "dress-value"],
    onExit: [],
  },
  {
    id: "late",
    text: "Đừng đến quá muộn nhé, bởi những khoảnh khắc tuyệt vời nhất sẽ chẳng chờ đợi ai đâu!",
    audioSrc: "/audio/26-late.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "dress",
    text: "Vậy nên, hãy diện cho mình một bộ trang phục thật xinh với sắc trắng hoặc đen…",
    audioSrc: "/audio/12-dress.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "smile",
    text: "Mang theo một nụ cười thật tươi, một trái tim thật vui…",
    audioSrc: "/audio/13-smile.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "ready",
    text: "Và chuẩn bị tinh thần để cùng chúng mình tạo nên một ngày sinh nhật không thể nào quên nhé!",
    audioSrc: "/audio/14-ready.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["program-0"],
    onExit: [],
    cues: [
      { id: "program-1", action: "program-1", afterWord: "cùng", atRatio: 0.28 },
      { id: "program-2", action: "program-2", afterWord: "chúng", atRatio: 0.4 },
      { id: "program-3", action: "program-3", afterWord: "sinh", atRatio: 0.62 },
    ],
  },
  {
    id: "hold",
    text: "Khoan đã… tưởng đến đây là hết bất ngờ rồi sao?",
    audioSrc: "/audio/15-hold.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["finale"],
    onExit: [],
  },
  {
    id: "not-yet",
    text: "Tất nhiên là chưa!",
    audioSrc: "/audio/16-not-yet.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "challenge",
    text: "Bữa tiệc hôm nay còn có một thử thách dành cho những vị khách may mắn… Hoặc cũng có thể là những vị khách kém may mắn nhất!",
    audioSrc: "/audio/17-challenge.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "wheel",
    text: "Xin giới thiệu… Vòng quay nhân phẩm!",
    audioSrc: "/audio/18-wheel.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "fate",
    text: "Liệu bạn sẽ trở thành khách VIP, hay sẽ khiến hai chủ tiệc phải khóc thét?",
    audioSrc: "/audio/19-fate.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "luck",
    text: "Hãy để vận may quyết định nhé!",
    audioSrc: "/audio/20-luck.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
  {
    id: "wish",
    text: "Chúc bạn có một ngày thật vui bên hai tiểu thiên thần của chúng mình!",
    audioSrc: "/audio/21-wish.mp3",
    enabled: true,
    skippable: true,
    onEnter: [],
    onExit: [],
  },
];

export function activeSegments(segments: StorySegment[] = storySegments) {
  return segments.filter((segment) => segment.enabled);
}

export function collectActions(segments: StorySegment[] = storySegments): StoryAction[] {
  const list: StoryAction[] = [];
  for (const segment of activeSegments(segments)) {
    const actions = [
      ...segment.onEnter,
      ...(segment.cues?.map((cue) => cue.action) ?? []),
      ...segment.onExit,
    ];
    for (const action of actions) {
      if (!list.includes(action)) list.push(action);
    }
  }
  return list;
}
