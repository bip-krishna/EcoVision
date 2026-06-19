export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  progress: number;
}

export const challenges: Challenge[] = [
  {
    id: "cycle-commuter",
    title: "Cycle Commuter",
    description: "Cycle to work 3 times this week",
    points: 50,
    icon: "🚲",
    progress: 0,
  },
  {
    id: "plastic-detox",
    title: "Plastic Detox",
    description: "Avoid single-use plastic for a day",
    points: 30,
    icon: "🧴",
    progress: 0,
  },
  {
    id: "energy-saver",
    title: "Energy Saver",
    description: "Reduce electricity by 10%",
    points: 40,
    icon: "💡",
    progress: 0,
  },
  {
    id: "green-eater",
    title: "Green Eater",
    description: "Go meat-free for a week",
    points: 60,
    icon: "🥗",
    progress: 0,
  },
  {
    id: "waste-warrior",
    title: "Waste Warrior",
    description: "Properly sort all waste for a week",
    points: 45,
    icon: "♻️",
    progress: 0,
  },
  {
    id: "water-guardian",
    title: "Water Guardian",
    description: "Reduce water usage by 15%",
    points: 35,
    icon: "💧",
    progress: 0,
  },
  {
    id: "tree-hugger",
    title: "Tree Hugger",
    description: "Plant a tree",
    points: 100,
    icon: "🌳",
    progress: 0,
  },
];
