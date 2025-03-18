const videContainerEl = document.querySelector(".video-container");
const searchInput = document.getElementById("search-value");
const searchBtn = document.getElementById("search");
let videosData = [];

const fetchVideosInfo = async ({ limit = 20, page = 1, sortBy = "latest" }) => {
  const response = await fetch(
    `https://api.freeapi.app/api/v1/public/youtube/videos?limit=${limit}&page=${page}&sortBy=${sortBy}`
  );

  const data = await response.json();

  return data;
};

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let key in intervals) {
    const count = Math.floor(seconds / intervals[key]);
    if (count >= 1) {
      return `${count} ${key}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const generateCard = (cardDetails) => {
  const cardHtml = `
    <div class="card">
        <div class="image-wrapper">
            <a href="https://www.youtube.com/watch?v=${
              cardDetails?.id
            }" target="_blank">
                <img
                src="${cardDetails?.snippet?.thumbnails?.high?.url}"
                alt=""
                />
            </a>
        </div>
        <div class="content-wrapper">
            <div class="user">
            <img
                src="${cardDetails?.snippet?.thumbnails?.default?.url}"
                alt=""
            />
            </div>
            <div class="content">
            <h3><a href="https://www.youtube.com/watch?v=${
              cardDetails?.id
            }" target="_blank">${cardDetails?.snippet?.title}</a></h3>
            <a href="https://www.youtube.com/channel/${
              cardDetails?.snippet?.channelId
            }" target="_blank">${cardDetails?.snippet?.channelTitle}</a>
            <p class="channel-analytics-info">
                <span>${cardDetails?.statistics?.viewCount} views</span>
                <span class="dot-separator">&#9679;</span>
                <span>${timeAgo(cardDetails?.snippet?.publishedAt)}</span>
            </p>
            </div>
        </div>
        </div>
  `;

  return cardHtml;
};

const displayVideos = async () => {
  let cards = "";

  const videoDetails = await fetchVideosInfo({ limit: 102 });
  videosData = [...videoDetails.data.data];

  videoDetails.data.data.forEach((details) => {
    cards += generateCard(details.items);
  });
  videContainerEl.innerHTML = cards;
};

const searchVideos = () => {
  let cards = "";
  const searchText = searchInput.value;

  let videosInfo = [];

  if (searchText.length) {
    videosInfo = videosData.filter((video) => {
      return (
        video.items.snippet.title
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        video.items.statistics.viewCount == searchText ||
        video.items.snippet.channelTitle
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  } else {
    videosInfo = videosData;
  }

  if (videosInfo.length) {
    videosInfo.forEach((details) => {
      cards += generateCard(details.items);
    });
  } else {
    cards =
      '<h1 style="text-align: center; color: #fff;">No Related Videos Found</h1>';
  }
  videContainerEl.innerHTML = cards;

  searchInput.value = "";
};

window.onload = displayVideos();

searchBtn.addEventListener("click", searchVideos);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchVideos();
  }
});
