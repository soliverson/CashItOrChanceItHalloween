document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ==================================================
    // ELEMENTS
    // ==================================================

    const introVideo =
      document.getElementById(
        "introVideo"
      );

    const introContainer =
      document.getElementById(
        "introVideoContainer"
      );

    const introButtons =
      document.getElementById(
        "introButtons"
      );

    const playButton =
      document.getElementById(
        "introPlayButton"
      );

    const skipButton =
      document.getElementById(
        "skipIntroButton"
      );

    const fullScreenButton =
      document.getElementById(
        "introFullScreenButton"
      );

    const watchIntroBtn =
      document.getElementById(
        "watchIntroBtn"
      );

    const backgroundMusic =
      document.getElementById(
        "backgroundMusic"
      );

    const musicToggleBtn =
      document.getElementById(
        "musicToggleBtn"
      );


    let musicEnabled = true;


    // ==================================================
    // BACKGROUND MUSIC
    // ==================================================

    if (backgroundMusic) {

      backgroundMusic.volume =
        0.12;

    }


    function updateMusicButton() {

      if (!musicToggleBtn) return;


      if (
        musicEnabled &&
        backgroundMusic &&
        !backgroundMusic.paused
      ) {

        musicToggleBtn.textContent =
          "🔊 Music On";

        musicToggleBtn.classList.remove(
          "music-off"
        );

      }

      else {

        musicToggleBtn.textContent =
          "🔇 Music Off";

        musicToggleBtn.classList.add(
          "music-off"
        );

      }

    }



    function startBackgroundMusic() {

      if (
        !backgroundMusic ||
        !musicEnabled
      ) {
        return;
      }


      backgroundMusic.volume =
        0.12;


      backgroundMusic
        .play()
        .then(() => {

          updateMusicButton();

        })
        .catch(err => {

          console.log(
            "Background music waiting for interaction:",
            err
          );

        });

    }



    function stopBackgroundMusic() {

      if (!backgroundMusic) return;

      backgroundMusic.pause();

      updateMusicButton();

    }



    // ==================================================
    // MUSIC BUTTON
    // ==================================================

    if (musicToggleBtn) {

      musicToggleBtn.addEventListener(
        "click",
        () => {

          if (!backgroundMusic) return;


          if (
            musicEnabled &&
            !backgroundMusic.paused
          ) {

            musicEnabled = false;

            stopBackgroundMusic();

          }

          else {

            musicEnabled = true;

            startBackgroundMusic();

          }

        }
      );

    }



    // ==================================================
    // PLAY INTRO
    // ==================================================

    if (playButton) {

      playButton.addEventListener(
        "click",
        () => {

          stopBackgroundMusic();

          introVideo.muted =
            false;

          introVideo
            .play()
            .catch(err => {

              console.error(
                "Video play error:",
                err
              );

            });


          introButtons.style.display =
            "none";

        }
      );

    }



    // ==================================================
    // INTRO FULLSCREEN
    // ==================================================

    if (fullScreenButton) {

      fullScreenButton.addEventListener(
        "click",
        () => {

          if (
            !document.fullscreenElement
          ) {

            document.documentElement
              .requestFullscreen()
              .catch(err => {

                console.error(
                  "Fullscreen error:",
                  err
                );

              });

          }

          else {

            document.exitFullscreen();

          }

        }
      );

    }



    // ==================================================
    // FULLSCREEN BUTTON TEXT
    // ==================================================

    document.addEventListener(
      "fullscreenchange",
      () => {

        if (!fullScreenButton) {
          return;
        }


        fullScreenButton.textContent =
          document.fullscreenElement
            ? "Exit Full Screen"
            : "Full Screen";

      }
    );



    // ==================================================
    // CLOSE INTRO
    // ==================================================

    function closeIntro() {

      introContainer.style.transition =
        "opacity 1s";

      introContainer.style.opacity =
        "0";


      setTimeout(() => {

        introContainer.style.display =
          "none";

      }, 1000);


      startBackgroundMusic();

    }



    // ==================================================
    // SKIP INTRO
    // ==================================================

    if (skipButton) {

      skipButton.addEventListener(
        "click",
        () => {

          introVideo.pause();

          closeIntro();

        }
      );

    }



    // ==================================================
    // INTRO FINISHED
    // ==================================================

    introVideo.addEventListener(
      "ended",
      () => {

        closeIntro();

      }
    );



    // ==================================================
    // WATCH INTRO AGAIN
    // ==================================================

    if (watchIntroBtn) {

      watchIntroBtn.addEventListener(
        "click",
        () => {

          stopBackgroundMusic();


          introVideo.pause();

          introVideo.currentTime =
            0;


          introContainer.style.display =
            "flex";

          introContainer.style.opacity =
            "1";


          introButtons.style.display =
            "flex";


          if (fullScreenButton) {

            fullScreenButton.textContent =
              document.fullscreenElement
                ? "Exit Full Screen"
                : "Full Screen";

          }

        }
      );

    }



    updateMusicButton();

  }
);