#!/bin/bash

# Define the base URL
BASE_URL="http://66.135.13.35:5000"

# Define stamp data
declare -A stamps=(
    [1]='{"id": 1, "uuid": "b10c4592-38fd-4cc8-96e2-e9ab3804f596", "exhibitName": "Future Tech", "boothNumber": "A1", "maker": "Tech Innovators", "youtubeLink": "https://www.youtube.com/embed/example1", "channelName": "Tech Innovators Channel", "stampUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/US_Airmail_inverted_Jenny_24c_1918_issue.jpg/640px-US_Airmail_inverted_Jenny_24c_1918_issue.jpg", "qrCode": "a9ad8f89-be30-4584-befb-699fc57636db", "description": "Explore cutting-edge technological advancements that are shaping the future. From sustainable energy solutions to smart city innovations, see how technology will change the way we live."}'
    # [2]='{"id": 2, "uuid": "d7b891e2-c0f3-4a3b-86e9-1a991e014fa8", "exhibitName": "Robotics Zone", "boothNumber": "A2", "maker": "Robotics Builders", "youtubeLink": "https://www.youtube.com/embed/example2", "channelName": "Robotics Builders Channel", "description": "Dive into the world of robotics where you can interact with robots of all shapes and sizes. Learn about robotic automation in industries and the future of robotics in healthcare."}'
    # [3]='{"id": 3, "uuid": "1c7f8615-8a91-47c7-89b0-a788b1d05424", "exhibitName": "Virtual Worlds", "boothNumber": "B1", "maker": "VR Pioneers", "youtubeLink": "https://www.youtube.com/embed/example3", "channelName": "VR Pioneers Channel", "description": "Step into different virtual realities that blend digital and physical worlds. Experience immersive games and simulations that push the boundaries of technology."}'
    # [4]='{"id": 4, "uuid": "75d876b5-638b-4b8f-95a3-24c9b1629f3f", "exhibitName": "Eco Innovations", "boothNumber": "B2", "maker": "Green Tech Solutions", "youtubeLink": "https://www.youtube.com/embed/example4", "channelName": "Green Tech Solutions Channel", "description": "Discover eco-friendly innovations that are helping to protect the planet. From biodegradable materials to new ways of generating clean energy, see what’s possible in eco-tech."}'
    # [5]='{"id": 5, "uuid": "0d26fbd7-ac20-4d3b-9d9b-c0a27e0c7bf7", "exhibitName": "Space Exploration", "boothNumber": "C1", "maker": "Star Explorers", "youtubeLink": "https://www.youtube.com/embed/example5", "channelName": "Star Explorers Channel", "description": "Reach for the stars with our space exploration exhibit. Learn about recent space missions, upcoming technologies, and how we’re preparing for life on other planets."}'
    # [6]='{"id": 6, "uuid": "ff648482-d5ad-49a9-a489-31cf4a8013e8", "exhibitName": "Underwater Tech", "boothNumber": "C2", "maker": "Oceanic Tech", "youtubeLink": "https://www.youtube.com/embed/example6", "channelName": "Oceanic Tech Channel", "description": "Submerge into the deep blue and discover technologies uncovering the mysteries of our oceans. From underwater drones to advanced scuba gear, explore the latest in aquatic technology."}'
    # [7]='{"id": 7, "uuid": "6d072ade-9893-478d-8425-ea2d1c3c7a27", "exhibitName": "AI Advancements", "boothNumber": "D1", "maker": "AI Innovators", "youtubeLink": "https://www.youtube.com/embed/example7", "channelName": "AI Innovators Channel", "description": "Witness artificial intelligence in action as it transforms industries from healthcare to finance. Engage with AI systems and learn about the ethical implications of this powerful technology."}'
    # [8]='{"id": 8, "uuid": "af432456-422f-4a25-b317-06e4b1a0b649", "exhibitName": "Gaming Galore", "boothNumber": "D2", "maker": "Game Masters", "youtubeLink": "https://www.youtube.com/embed/example8", "channelName": "Game Masters Channel", "description": "Enter the gamer’s paradise with the latest in video game technology. Try out new gaming consoles, virtual reality setups, and interactive games that are fun for all ages."}'
)

# Loop through stamps and post each one
for key in "${!stamps[@]}"
do
    echo "Posting stamp ID $key"
    response=$(curl -s -X POST "$BASE_URL/stamps" -H "Content-Type: application/json" -d "${stamps[$key]}")
    echo "Response: $response"
    echo "======================================"
done

echo "All stamps posted."
