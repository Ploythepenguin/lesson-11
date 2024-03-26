// Usually a good practice to add this when working with dom elements so everything is loaded in first before we can manipulate the dom


document.addEventListener("DOMContentLoaded", function(){
    const audioElement = document.querySelector("audio");
    const playButton = document.querySelector(".player-play-btn");
    const playIcon = document.querySelector(".player-icon-play");
    const pauseIcon = document.querySelector(".player-icon-pause");
    const progress = document.querySelector(".player-progress");
    const progressFilled = document.querySelector(".player-progress-filled");
    const playerCurrentTime = document.querySelector(".player-time-current");
    const playerDuration = document.querySelector(".player-time-duration");
    const playList = document.querySelector(".playlist");
    const forwardButton = document.querySelector(".forward-btn");
    const previousButton = document.querySelector(".previous-btn");

    // Added this:
    let mousedown = false; 

    let songsListIndex = 0;

    const songs = [
        {src: "songs/timmy-trumpet-freaks.mp3", artist: 'Timmy Trumpet', title: 'Freaks'},
        {src: "songs/noisestorm-crab-rave.mp3" , artist: 'Noise Storm', title: 'Crab Rave'},
        {src: "songs/infected-mushroom-becoming-insane.mp3" , artist: 'Infected Mushroom', title: 'Becoming Insane'},
        {src: "songs/artax-8-bits-of-bliss.mp3" , artist: 'Artax', title: '8 Bits of bliss'},
        {src: "songs/bombs-away-drunk-arcade.mp3" , artist: 'Bombs Away', title: 'Drunk Arkade'}    
    ]
    // Added .src
    audioElement.src = songs[0].src;
    let currentSongIndex = 0;

    function generatePlaylist(songsToDisplay) {
        songsToDisplay = songsToDisplay || songs; 
        console.log(songsToDisplay)
        
        const playlistContainer = document.querySelector('.playlist');
        playlistContainer.innerHTML = '';

        songsToDisplay.forEach((song, index) => {
            const songDiv = document.createElement('div');

            songDiv.className = `song-${index + 1}`;
            songDiv.id = "song";
            songDiv.innerHTML = `
            <p class = "song-order>${index + 1}</p>
            <img src= "images/play-button.png" class ="play-btn">
                <p class="song-details">
                    <span class="song">${song.title}</span>
                    <span class="artist">${song.artist}</span>
                </p>`;
            songDiv.addEventListener('dblclick', () => playSong(index));
            playlistContainer.appendChild(songDiv);
        });
    }

    // Move it so it can be accessed globally in your JS document
    function playSong(index) {
        const song = songs[index];
        audioElement.src = song.src; // Ensure you're setting the source to the song's src
        console.log(audioElement)
        audioElement.play();

        playButton.dataset.playing = "true";
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
        currentSongIndex = index; // Update the currentSongIndex with the played song index
    }


    window.addEventListener("load", () => {
        // You had to call this function to make your playlist load otherwise the songs wont be shown
        generatePlaylist() 

        // Player controls

        setTimes();

        audioElement.addEventListener("timeupdate", () => {
            setTimes();
            progressUpdate();
        });

        audioElement.addEventListener("ended", () => {
            playButton.dataset.playing = "false";
            pauseIcon.classList.add("hidden");
            playIcon.classList.remove("hidden");
            progressFilled.style.flexBasis = "0%";
            audioElement.currentTime = 0;
            audioElement.duration = audioElement.duration;

            // Removed for loop and simplified logic
            currentSongIndex = (currentSongIndex + 1) % songs.length; // Move to the next song or loop to the start
            audioElement.src = songs[currentSongIndex].src;
            playSong(audioElement);

        });

        playButton.addEventListener("click", () => {
            if (playButton.dataset.playing === "false") {
                // Pass our index to the playsong function
                playSong(currentSongIndex);

            } else {
                // No need to send any parameters
                pauseSong();

            }

        });
        
    function switchTrack(index) {
        // Get the src from the object otherwise it wont play the song
        audioElement.src = songs[index].src;
        audioElement.currentTime = 0;
        audioElement.play();
    }

    previousButton.addEventListener("click", function() {
        songsListIndex = (songsListIndex - 1 + songs.length) % songs.length;
        switchTrack(songsListIndex);
    });

    forwardButton.addEventListener("click", function() {
        songsListIndex = (songsListIndex + 1) % songs.length;
        switchTrack(songsListIndex);
    });

    function pauseSong() {
        // audioElement.pause instead
        audioElement.pause();

        playButton.dataset.playing = "false";
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
    }

    function setTimes() {
        const newCurrentTime = new Date(audioElement.currentTime * 1000);
        const newDuration = new Date(audioElement.duration * 1000);

        playerCurrentTime.textContent = newCurrentTime.getMinutes() + ':' + newCurrentTime.getSeconds();
        playerDuration.textContent = newDuration.getMinutes() + ':' + newDuration.getSeconds();
    }

        function progressUpdate() {
            const percent = (audioElement.currentTime / audioElement.duration) * 100;
            progressFilled.style.flexBasis = `${percent}%`;
        }

        function scrub (event) {
            const scrubTime = (event.offsetX / progress.offsetWidth) * audioElement.duration;
            audioElement.currentTime = scrubTime;
        }

        progress.addEventListener("click", scrub);
        progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
        progress.addEventListener("mousedown", () => (mousedown = true));
        progress.addEventListener("mouseup", () => (mousedown = false));

    });
})
