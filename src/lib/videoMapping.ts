export interface VideoMapping {
  id: string;
  title: string;
}

const goalVideos: Record<string, VideoMapping> = {
  "fat loss": { id: "UBMk30rjy0o", title: "HIIT Fat Burn for Women" },
  strength: { id: "ml6cT4AZdqI", title: "Women's Strength Training" },
  "muscle tone": { id: "IT94xC35u6k", title: "Toning Workout for Women" },
  endurance: { id: "UItWltVZZmE", title: "Cardio Endurance for Women" },
  flexibility: { id: "v7AYKMP6rOE", title: "Full Body Flexibility" },
  "general fitness": { id: "cbKkB3POqaY", title: "Full Body Beginner Workout" },
};

const gentleVideo: VideoMapping = {
  id: "v7AYKMP6rOE",
  title: "Gentle Restorative Stretch",
};

const beginnerOverrides: Record<string, VideoMapping> = {
  "fat loss": { id: "cbKkB3POqaY", title: "Beginner Fat Burn for Women" },
  strength: { id: "cbKkB3POqaY", title: "Beginner Strength for Women" },
  endurance: { id: "cbKkB3POqaY", title: "Beginner Cardio for Women" },
};

export function getVideoForPlan(
  goal: string,
  experience: string,
  cyclePhase: string
): VideoMapping {
  // Menstrual/luteal → gentle/restorative
  if (cyclePhase === "menstrual" || cyclePhase === "luteal") {
    return gentleVideo;
  }

  // Beginner overrides
  if (experience === "beginner" && beginnerOverrides[goal]) {
    return beginnerOverrides[goal];
  }

  return goalVideos[goal] || goalVideos["general fitness"];
}

export function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
