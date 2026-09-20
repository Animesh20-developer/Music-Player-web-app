
const songs = [
  {
    title: "kesariya",
    artist: "Arijit Singh",
    src: "songs/song1.mp3",
    cover: "https://placehold.co/400x400/7c3aed/ffffff?text=Song+1"
  },
  {
    title: "Phir Aur Kya Chahiye",
    artist: "Arijit Singh",
    src: "songs/song2.mp3",
    cover: "https://placehold.co/400x400/0891b2/ffffff?text=Song+2"
  },
  {
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    src: "songs/song3.mp3",
    cover: "https://placehold.co/400x400/db2777/ffffff?text=Song+3"
  }
];
// const audio=document.querySelector("audio");
// function playSong(song){
//   audio.src=song.src;
//   audio.play();
// }

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const songsContainer = document.getElementById("songs");
const search = document.getElementById("search");

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function loadSong(index) {
  currentIndex = index;

  const song = songs[currentIndex];

  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;

  audio.src = song.src;

  progress.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
}

function playSong() {
  audio.play()
    .then(() => {
      isPlaying = true;
      playBtn.textContent = "⏸";
    })
    .catch(() => {
      isPlaying = false;
      playBtn.textContent = "▶";
    });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

function nextSong() {
  if (isShuffle) {
    let nextIndex;

    do {
      nextIndex = Math.floor(Math.random() * songs.length);
    } while (songs.length > 1 && nextIndex === currentIndex);

    loadSong(nextIndex);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
  }

  playSong();
}

function prevSong() {
  currentIndex =
    (currentIndex - 1 + songs.length) % songs.length;

  loadSong(currentIndex);
  playSong();
}

document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", prevSong);

document.getElementById("shuffle").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle").style.opacity =
    isShuffle ? "1" : "0.5";
});

document.getElementById("repeat").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat").style.opacity =
    isRepeat ? "1" : "0.5";
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.value =
    (audio.currentTime / audio.duration) * 100;

  currentTime.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;

  audio.currentTime =
    (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function displaySongs(songList) {
  songsContainer.innerHTML = "";

  songList.forEach((song) => {
    const originalIndex = songs.indexOf(song);

    const div = document.createElement("div");
    div.className = "song";

    div.innerHTML = `
      <img src="${song.cover}" alt="Album cover">
      <div class="song-info">
        <strong>${song.title}</strong>
        <p>${song.artist}</p>
      </div>
      <span>▶</span>
    `;

    div.addEventListener("click", () => {
      loadSong(originalIndex);
      playSong();
    });

    songsContainer.appendChild(div);
  });
}

search.addEventListener("input", () => {
  const query = search.value.toLowerCase();

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query)
  );

  displaySongs(filteredSongs);
});

loadSong(0);
displaySongs(songs);