import type { StoryAction, StorySegment } from "../types/story";

/**
 * Lời dẫn và các mốc xuất hiện.
 * Đổi `text` rồi chạy `npm run generate:audio` để tạo lại giọng đọc.
 * `enabled: false` sẽ bỏ qua cả câu đọc lẫn hiệu ứng của phân đoạn đó.
 * `afterWord` bám theo từ trong audio. `atRatio` là tỷ lệ thời lượng thật của file.
 */
export const storySegments: StorySegment[] = [
  {
    id: "memory",
    text: "Cách đây 23 năm về trước…",
    audioSrc: "/audio/01-memory.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["memory-in"],
    onExit: ["memory-out"],
  },
  {
    id: "angels",
    text: "Thế giới đã chào đón sự xuất hiện của hai tiểu thiên thần đáng yêu.",
    audioSrc: "/audio/02-angels.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["angels-in"],
    onExit: [],
  },
  {
    id: "personalities",
    text: "Hai cô gái, hai cá tính, hai câu chuyện riêng…",
    audioSrc: "/audio/03-personalities.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["frames-in"],
    onExit: [],
  },
  {
    id: "together",
    text: "Và hôm nay, chúng mình muốn cùng nhau tạo nên một kỷ niệm thật đặc biệt.",
    audioSrc: "/audio/04-together.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["together-in"],
    onExit: [],
  },
  {
    id: "joy",
    text: "Một ngày để cười thật nhiều, lưu giữ những khoảnh khắc đáng nhớ và chia sẻ niềm vui cùng những người thân yêu.",
    audioSrc: "/audio/05-joy.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["joy-in"],
    onExit: [],
  },
  {
    id: "leads",
    text: "Và nhân vật chính của ngày hôm nay chính là…",
    audioSrc: "/audio/06-leads.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["focus-in"],
    onExit: [],
  },
  {
    id: "name-tien",
    text: "Kim Tiền…",
    audioSrc: "/audio/07-name-tien.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["name-left"],
    onExit: [],
  },
  {
    id: "name-uyen",
    text: "Và Phương Uyên!",
    audioSrc: "/audio/08-name-uyen.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["name-right"],
    onExit: [],
  },
  {
    id: "invite",
    text: "Chúng mình trân trọng mời bạn đến tham dự bữa tiệc sinh nhật đặc biệt này.",
    audioSrc: "/audio/09-invite.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["hero-in"],
    onExit: [],
  },
  {
    id: "dress",
    text: "Hãy cùng diện dress code trắng và đen, chuẩn bị cho một buổi tối thật xinh đẹp, thật vui và thật đáng nhớ.",
    audioSrc: "/audio/10-dress.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["dress-label"],
    onExit: [],
    cues: [
      {
        id: "dress-value",
        action: "dress-value",
        afterWord: "trắng",
        atRatio: 0.22,
      },
    ],
  },
  {
    id: "gift",
    text: "Sự hiện diện của bạn chính là món quà tuyệt vời nhất dành cho chúng mình.",
    audioSrc: "/audio/11-gift.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["event-time"],
    onExit: [],
    cues: [
      {
        id: "event-place",
        action: "event-place",
        afterWord: "món",
        atRatio: 0.42,
      },
    ],
  },
  {
    id: "farewell",
    text: "Hẹn gặp bạn tại bữa tiệc nhé!",
    audioSrc: "/audio/12-farewell.mp3",
    enabled: true,
    skippable: true,
    onEnter: ["program-0"],
    onExit: ["finale"],
    cues: [
      { id: "program-1", action: "program-1", afterWord: "gặp", atRatio: 0.28 },
      { id: "program-2", action: "program-2", afterWord: "bạn", atRatio: 0.5 },
      { id: "program-3", action: "program-3", afterWord: "tiệc", atRatio: 0.74 },
    ],
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
