const USER={
  username:"animesh25",
  password:"12345"
};

const songs=[
  {
    title:"Kesariya",
    artist:"Arijit Singh",
    src:"songs/song1.mp3",
    cover:"https://placehold.co/400x400/7c3aed/fff?text=Song+1"
  },
  {
    title:"Phir Aur Kya Chahiye",
    artist:"Arijit Singh",
    src:"songs/song2.mp3",
    cover:"https://placehold.co/400x400/0891b2/fff?text=Song+2"
  },
  {
    title:"Apna Bana Le",
    artist:"Arijit Singh",
    src:"songs/song3.mp3",
    cover:"https://placehold.co/400x400/db2777/fff?text=Song+3"
  }
];

const login=document.getElementById("login");
const music=document.getElementById("music");
const audio=document.getElementById("audio");

let index=0;
let playing=false;

document.getElementById("loginBtn").onclick=()=>{
  let u=document.getElementById("username").value;
  let p=document.getElementById("password").value;

  if(u===USER.username && p===USER.password){
    login.classList.add("hidden");
    music.classList.remove("hidden");
    load(0);
  }else{
    document.getElementById("error").textContent=
      "Wrong username or password!";
  }
};

function load(i){
  index=i;
  let s=songs[i];

  document.getElementById("title").textContent=s.title;
  document.getElementById("artist").textContent=s.artist;
  document.getElementById("cover").src=s.cover;
  audio.src=s.src;
}

document.getElementById("play").onclick=()=>{
  if(playing){
    audio.pause();
    playing=false;
    document.getElementById("play").textContent="▶";
  }else{
    audio.play();
    playing=true;
    document.getElementById("play").textContent="⏸";
  }
};

document.getElementById("next").onclick=()=>{
  load((index+1)%songs.length);
  audio.play();
  playing=true;
};

document.getElementById("prev").onclick=()=>{
  load((index-1+songs.length)%songs.length);
  audio.play();
  playing=true;
};

audio.onended=()=>{
  load((index+1)%songs.length);
  audio.play();
};

document.getElementById("volume").oninput=e=>{
  audio.volume=e.target.value;
};

audio.ontimeupdate=()=>{
  if(audio.duration)
    document.getElementById("progress").value=
      audio.currentTime/audio.duration*100;
};

document.getElementById("progress").oninput=e=>{
  audio.currentTime=
    e.target.value/100*audio.duration;
};

function showSongs(list){
  document.getElementById("songs").innerHTML="";

  list.forEach((s)=>{
    let i=songs.indexOf(s);

    let div=document.createElement("div");
    div.className="song";

    div.innerHTML=`
      <img src="${s.cover}">
      <div class="song-info">
        <b>${s.title}</b>
        <p>${s.artist}</p>
      </div>
      ▶
    `;

    div.onclick=()=>{
      load(i);
      audio.play();
      playing=true;
    };

    document.getElementById("songs").appendChild(div);
  });
}

showSongs(songs);

document.getElementById("search").oninput=e=>{
  let q=e.target.value.toLowerCase();

  showSongs(
    songs.filter(s=>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q)
    )
  );
};