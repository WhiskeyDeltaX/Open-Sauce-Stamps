
const stampsData = [
  { 
    id: 1, 
    exhibitName: 'Future Tech', 
    boothNumber: 'A1', 
    maker: 'Tech Innovators', 
    youtubeLink: 'https://www.youtube.com/embed/example1', 
    channelName: 'Tech Innovators Channel', 
    description: 'Explore cutting-edge technological advancements that are shaping the future. From sustainable energy solutions to smart city innovations, see how technology will change the way we live.' 
  },
  { 
    id: 2, 
    exhibitName: 'Robotics Zone', 
    boothNumber: 'A2', 
    maker: 'Robotics Builders', 
    youtubeLink: 'https://www.youtube.com/embed/example2', 
    channelName: 'Robotics Builders Channel', 
    description: 'Dive into the world of robotics where you can interact with robots of all shapes and sizes. Learn about robotic automation in industries and the future of robotics in healthcare.' 
  },
  { 
    id: 3, 
    exhibitName: 'Virtual Worlds', 
    boothNumber: 'B1', 
    maker: 'VR Pioneers', 
    youtubeLink: 'https://www.youtube.com/embed/example3', 
    channelName: 'VR Pioneers Channel', 
    description: 'Step into different virtual realities that blend digital and physical worlds. Experience immersive games and simulations that push the boundaries of technology.' 
  },
  { 
    id: 4, 
    exhibitName: 'Eco Innovations', 
    boothNumber: 'B2', 
    maker: 'Green Tech Solutions', 
    youtubeLink: 'https://www.youtube.com/embed/example4', 
    channelName: 'Green Tech Solutions Channel', 
    description: 'Discover eco-friendly innovations that are helping to protect the planet. From biodegradable materials to new ways of generating clean energy, see what’s possible in eco-tech.' 
  },
  { 
    id: 5, 
    exhibitName: 'Space Exploration', 
    boothNumber: 'C1', 
    maker: 'Star Explorers', 
    youtubeLink: 'https://www.youtube.com/embed/example5', 
    channelName: 'Star Explorers Channel', 
    description: 'Reach for the stars with our space exploration exhibit. Learn about recent space missions, upcoming technologies, and how we’re preparing for life on other planets.' 
  },
  { 
    id: 6, 
    exhibitName: 'Underwater Tech', 
    boothNumber: 'C2', 
    maker: 'Oceanic Tech', 
    youtubeLink: 'https://www.youtube.com/embed/example6', 
    channelName: 'Oceanic Tech Channel', 
    description: 'Submerge into the deep blue and discover technologies uncovering the mysteries of our oceans. From underwater drones to advanced scuba gear, explore the latest in aquatic technology.' 
  },
  { 
    id: 7, 
    exhibitName: 'AI Advancements', 
    boothNumber: 'D1', 
    maker: 'AI Innovators', 
    youtubeLink: 'https://www.youtube.com/embed/example7', 
    channelName: 'AI Innovators Channel', 
    description: 'Witness artificial intelligence in action as it transforms industries from healthcare to finance. Engage with AI systems and learn about the ethical implications of this powerful technology.' 
  },
  { 
    id: 8, 
    exhibitName: 'Gaming Galore', 
    boothNumber: 'D2', 
    maker: 'Game Masters', 
    youtubeLink: 'https://www.youtube.com/embed/example8', 
    channelName: 'Game Masters Channel', 
    description: 'Enter the gamer’s paradise with the latest in video game technology. Try out new gaming consoles, virtual reality setups, and interactive games that are fun for all ages.' 
  }
];

export const getStampById = (id) => {
  return stampsData.find(stamp => stamp.id === parseInt(id));
};

export const getAllStamps = () => {
  return stampsData;
};
