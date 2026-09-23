// ======================================================
// CASH IT OR CHANCE IT
// GAME LOGIC
// ======================================================


// ======================================================
// GAME STATE / FLAGS
// ======================================================

// Prevents the Chance It button from being handled twice.
let declineHandled = false;


// ======================================================
// REVEAL HELPERS
// ======================================================

/*
  Adds the dark overlay behind an enlarged photo reveal.

  The CSS uses:
  body.reveal-active::after
*/
function startRevealBackdrop() {
  document.body.classList.add("reveal-active");
}


/*
  Removes the dark overlay.
*/
function stopRevealBackdrop() {
  document.body.classList.remove("reveal-active");
}


/*
  Smoothly removes an enlarged reveal.

  This prevents the photo from simply disappearing abruptly.
*/
function removeReveal(clone, callback) {

  if (!clone) {
    stopRevealBackdrop();

    if (callback) {
      callback();
    }

    return;
  }

  clone.style.transition =
    "opacity 0.35s ease, transform 0.35s ease";

  clone.style.opacity = "0";

  /*
    Keep the centering transform while slightly shrinking
    the reveal.
  */
  clone.style.transform =
    "translate(-50%, -50%) scale(0.94)";

  setTimeout(() => {

    if (clone && clone.parentNode) {
      clone.remove();
    }

    stopRevealBackdrop();

    if (callback) {
      callback();
    }

  }, 350);
}


// ======================================================
// BRIEFCASE / PHOTO CLICK
// ======================================================

function briefcaseClicked(box) {

  // ------------------------------------------------------
  // FIRST CLICK: Choose the player's pick
  // ------------------------------------------------------

  if (!chosenBox) {

    chosenBox = box;

    const casesToOpen =
      rounds[currentRound];


    // Update the board immediately so the selected
    // photo receives its green highlight.
    renderBriefcases();

    updateSidePanels();


    /*
      Lock the board while the selected-pick reveal
      is being displayed.
    */
    offerActive = true;


    const briefcase =
      document.getElementById(
        "briefcase-" + box
      );


    if (!briefcase) {
      offerActive = false;
      return;
    }


    // ------------------------------------------------------
    // CREATE LARGE PLAYER-PICK REVEAL
    // ------------------------------------------------------

    const clone =
      briefcase.cloneNode(true);


    /*
      Completely replace the clone contents.

      This avoids carrying the original number badge
      and other grid-card elements into the reveal.
    */
    clone.innerHTML = `

      <img
        class="center-img"
        src="${boxImages[box]}"
        alt="Your Pick ${box}"
      >

      <div class="personal-box-message">
        THIS IS YOUR PICK!
      </div>

      <div class="center-amount">
        PICK #${box}
      </div>

    `;


    clone.classList.add(
      "center-open",
      "personal-box-reveal"
    );


    /*
      The enlarged reveal should never respond to
      mouse hover or clicks.
    */
    clone.style.pointerEvents =
      "none";


    /*
      Start hidden so we can fade it in smoothly.
    */
    clone.style.opacity =
      "0";


    document.body.appendChild(
      clone
    );


    // Darken the game board.
    startRevealBackdrop();


    /*
      Allow the browser to place the element first,
      then fade it in.
    */
    requestAnimationFrame(() => {

      clone.style.transition =
        "opacity 0.3s ease";

      clone.style.opacity =
        "1";

    });


    // ------------------------------------------------------
    // SHOW PLAYER PICK FOR 5 SECONDS
    // ------------------------------------------------------

    setTimeout(() => {

      removeReveal(
        clone,
        () => {

          // ----------------------------------------------
          // AFTER REVEAL: SHOW NEXT INSTRUCTION
          // ----------------------------------------------

          const offerDetails =
            document.getElementById(
              "offerDetails"
            );


          if (offerDetails) {

            offerDetails.innerHTML = `

              <p class="message">
                Your pick is
                <strong>#${box}</strong>
              </p>

              <p class="cases-to-open">
                Now choose
                <strong>${casesToOpen}</strong>
                photo${casesToOpen === 1 ? "" : "s"}
                to reveal.
              </p>

            `;

          }


          const offerModal =
            document.getElementById(
              "offerModal"
            );


          if (offerModal) {

            offerModal.style.display =
              "flex";

          }


          // ----------------------------------------------
          // KEEP INSTRUCTION UP FOR 6 SECONDS
          // ----------------------------------------------

          setTimeout(() => {

            if (offerModal) {

              offerModal.style.display =
                "none";

            }


            const gameMessage =
              document.getElementById(
                "gameMessage"
              );


            if (gameMessage) {

              gameMessage.textContent =
                `Choose ${casesToOpen} photo${casesToOpen === 1 ? "" : "s"} to reveal.`;

            }


            /*
              Unlock the board only after the instruction
              popup has disappeared.
            */
            offerActive =
              false;

          }, 6000);

        }
      );

    }, 5000);


    return;
  }


  // ------------------------------------------------------
  // NORMAL GAME PLAY
  // ------------------------------------------------------

  /*
    Never allow the player's selected pick
    to be revealed during normal rounds.
  */
  if (box === chosenBox) {
    return;
  }


  /*
    Don't allow an already-revealed photo
    to be selected again.
  */
  if (openedStatus[box]) {
    return;
  }


  /*
    Don't allow another photo to be clicked
    while a reveal or offer is active.
  */
  if (offerActive) {
    return;
  }


  openBriefcase(box);
}


// ======================================================
// REVEAL A PHOTO
// ======================================================

function openBriefcase(box) {

  /*
    Immediately lock clicks while this photo
    is being revealed.
  */
  offerActive = true;


  openedStatus[box] =
    true;


  const briefcase =
    document.getElementById(
      "briefcase-" + box
    );


  if (!briefcase) {

    offerActive =
      false;

    return;
  }


  // ------------------------------------------------------
  // CREATE LARGE PHOTO REVEAL
  // ------------------------------------------------------

  const clone =
    briefcase.cloneNode(true);


  clone.innerHTML = `

    <img
      class="center-img"
      src="${boxImages[box]}"
      alt="Photo ${box}"
    >

    <div class="center-amount">

      $${boxValues[box].toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}

    </div>

  `;


  clone.classList.add(
    "center-open"
  );


  clone.style.pointerEvents =
    "none";


  clone.style.opacity =
    "0";


  document.body.appendChild(
    clone
  );


  // Darken the board.
  startRevealBackdrop();


  // Smooth reveal.
  requestAnimationFrame(() => {

    clone.style.transition =
      "opacity 0.3s ease";

    clone.style.opacity =
      "1";

  });


  // ------------------------------------------------------
  // REMOVE PRIZE VALUE FROM REMAINING VALUES
  // ------------------------------------------------------

  const idx =
    valuesRemaining.indexOf(
      boxValues[box]
    );


  if (idx > -1) {

    valuesRemaining.splice(
      idx,
      1
    );

  }


  // Count revealed photo.
  openedCount++;


  /*
    Update the board behind the reveal.

    The selected photo will now appear faded/opened
    when the large reveal disappears.
  */
  renderBriefcases();

  updateSidePanels();


  // ------------------------------------------------------
  // FIND UNREVEALED PICKS BESIDES PLAYER'S PICK
  // ------------------------------------------------------

  const unopened =
    boxes.filter(
      b =>
        !openedStatus[b] &&
        b !== chosenBox
    );


  // ------------------------------------------------------
  // UPDATE INSTRUCTION TEXT
  // ------------------------------------------------------

  if (
    currentRound <
    rounds.length
  ) {

    const casesNeeded =
      rounds[currentRound];


    const casesLeftThisRound =
      Math.max(
        casesNeeded - openedCount,
        0
      );


    if (
      casesLeftThisRound > 0
    ) {

      const gameMessage =
        document.getElementById(
          "gameMessage"
        );


      if (gameMessage) {

        gameMessage.textContent =
          `Choose ${casesLeftThisRound} more photo${casesLeftThisRound === 1 ? "" : "s"} to reveal.`;

      }

    }

  }


  // ------------------------------------------------------
  // FINAL TWO PICKS
  // ------------------------------------------------------

  if (
    unopened.length === 1 &&
    !finalSwapActive
  ) {

    /*
      Keep the final revealed amount on screen long
      enough for everyone to see it.
    */
    setTimeout(() => {

      removeReveal(
        clone,
        () => {

          finalSwap();

        }
      );

    }, 5000);


    return;
  }


  // ------------------------------------------------------
  // END OF ROUND -> OFFER
  // ------------------------------------------------------

  if (
    currentRound <
      rounds.length &&
    openedCount >=
      rounds[currentRound]
  ) {

    const gameMessage =
      document.getElementById(
        "gameMessage"
      );


    if (gameMessage) {

      gameMessage.textContent =
        "Waiting for your offer...";

    }


    /*
      Leave the final photo/value visible for five
      seconds, then remove it and show the offer.
    */
    setTimeout(() => {

      removeReveal(
        clone,
        () => {

          playSound(
            "offerSound"
          );


          offerDeal();


          /*
            Reset revealed-photo count for the
            next round.
          */
          openedCount =
            0;

        }
      );

    }, 5000);


    return;
  }


  // ------------------------------------------------------
  // NORMAL REVEAL WITH MORE PICKS LEFT THIS ROUND
  // ------------------------------------------------------

  setTimeout(() => {

    removeReveal(
      clone,
      () => {

        /*
          Player may now select the next photo.
        */
        offerActive =
          false;

      }
    );

  }, 5000);

}


// ======================================================
// FINAL SWAP
// ======================================================

function finalSwap() {

  if (finalSwapActive) {
    return;
  }


  finalSwapActive =
    true;

  offerActive =
    true;


  stopSound(
    "suspenseMusic"
  );

  stopRevealBackdrop();


  const finalHTML = `

    <p class="message">
      FINAL DECISION
    </p>

    <p class="message">
      Do you want to keep your pick
      or swap it with the last remaining pick?
    </p>

    <button
      class="deal"
      onclick="keepBox()"
    >
      KEEP MY PICK
    </button>

    <button
      class="decline"
      onclick="swapBox()"
    >
      SWAP MY PICK
    </button>

  `;


  const offerDetails =
    document.getElementById(
      "offerDetails"
    );


  if (offerDetails) {

    offerDetails.innerHTML =
      finalHTML;

  }


  const offerModal =
    document.getElementById(
      "offerModal"
    );


  if (offerModal) {

    offerModal.style.display =
      "flex";

  }


  playSound(
    "finalSwapMusic"
  );

}


// ======================================================
// KEEP PICK
// ======================================================

function keepBox() {

  stopSound(
    "suspenseMusic"
  );

  stopSound(
    "finalSwapMusic"
  );


  const resultHTML = `

    <p class="message">
      YOU KEPT PICK #${chosenBox}!
    </p>

    <p class="message">
      IT CONTAINS:
    </p>

    <p class="bank-offer">

      $${boxValues[chosenBox].toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}

    </p>

    <button onclick="playAgain()">
      PLAY AGAIN
    </button>

  `;


  document.getElementById(
    "offerDetails"
  ).innerHTML =
    resultHTML;


  document
    .querySelector(
      ".modal-content"
    )
    .classList.add(
      "result-modal"
    );


  playSound(
    "applause"
  );


  launchFireworks();

}


// ======================================================
// SWAP PICK
// ======================================================

function swapBox() {

  stopSound(
    "suspenseMusic"
  );

  stopSound(
    "finalSwapMusic"
  );


  const unopened =
    boxes.filter(
      b =>
        !openedStatus[b] &&
        b !== chosenBox
    );


  const newBox =
    unopened[0];


  chosenBox =
    newBox;


  const resultHTML = `

    <p class="message">
      YOU SWAPPED YOUR PICK!
    </p>

    <p class="message">
      PICK #${chosenBox} CONTAINS:
    </p>

    <p class="bank-offer">

      $${boxValues[chosenBox].toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}

    </p>

    <button onclick="playAgain()">
      PLAY AGAIN
    </button>

  `;


  document.getElementById(
    "offerDetails"
  ).innerHTML =
    resultHTML;


  document
    .querySelector(
      ".modal-content"
    )
    .classList.add(
      "result-modal"
    );


  playSound(
    "applause"
  );


  launchFireworks();

}


// ======================================================
// OFFER CALCULATION
// ======================================================

function getBankersOffer(values) {

  /*
    Safety check in case the array ever becomes empty.
  */
  if (
    !values ||
    values.length === 0
  ) {

    return 0;

  }


  const sum =
    values.reduce(
      (acc, curr) =>
        acc + curr,
      0
    );


  const average =
    sum / values.length;


  /*
    Offers become more generous as the
    game progresses.
  */
  const offerPercentages = [

    0.35, // Round 1
    0.45, // Round 2
    0.55, // Round 3
    0.65, // Round 4
    0.75, // Round 5
    0.85, // Round 6
    0.90, // Round 7
    0.95, // Round 8
    1.00  // Final rounds

  ];


  const percentage =
    offerPercentages[
      currentRound
    ] ?? 1;


  let offer =
    average *
    percentage;


  /*
    Keep early offers from becoming too large.
  */
  if (
    currentRound === 0
  ) {

    offer =
      Math.min(
        offer,
        75
      );

  }


  if (
    currentRound === 1
  ) {

    offer =
      Math.min(
        offer,
        100
      );

  }


  /*
    Round to nearest $5.
  */
  offer =
    Math.round(
      offer / 5
    ) * 5;


  return offer;

}


// ======================================================
// SHOW OFFER
// ======================================================

function offerDeal() {

  /*
    Keep board locked while offer is showing.
  */
  offerActive =
    true;


  stopRevealBackdrop();


  const offer =
    getBankersOffer(
      valuesRemaining
    );


  offersHistory.push(
    offer
  );


  updateOffersHistory();


  const offerHTML = `

    <p class="message">
      YOUR OFFER IS:
    </p>

    <p class="bank-offer">

      $${offer.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}

    </p>

    <p class="message">
      CASH IT OR CHANCE IT?
    </p>

    <button
      class="deal"
      onclick="acceptDeal(${offer})"
    >
      CASH IT
    </button>

    <button
      class="decline"
      onclick="declineDealModal()"
    >
      CHANCE IT
    </button>

  `;


  document.getElementById(
    "offerDetails"
  ).innerHTML =
    offerHTML;


  document.getElementById(
    "offerModal"
  ).style.display =
    "flex";


  playSound(
    "suspenseMusic"
  );

}


// ======================================================
// CASH IT
// ======================================================

function acceptDeal(offer) {

  stopSound(
    "suspenseMusic"
  );


  const resultHTML = `

    <p class="message">
      YOU CASHED IT FOR
    </p>

    <p class="bank-offer">

      $${offer.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}!

    </p>

    <p class="message">
      PICK #${chosenBox} CONTAINED:
    </p>

    <p class="bank-offer">

      $${boxValues[chosenBox].toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}

    </p>

    <button onclick="playAgain()">
      PLAY AGAIN
    </button>

  `;


  document.getElementById(
    "offerDetails"
  ).innerHTML =
    resultHTML;


  document
    .querySelector(
      ".modal-content"
    )
    .classList.add(
      "result-modal"
    );


  playSound(
    "applause"
  );


  launchFireworks();

}


// ======================================================
// CHANCE IT
// ======================================================

function declineDealModal() {

  if (declineHandled) {
    return;
  }


  declineHandled =
    true;


  stopSound(
    "suspenseMusic"
  );


  playSound(
    "declineSound"
  );


  // ------------------------------------------------------
  // MOVE TO NEXT ROUND
  // ------------------------------------------------------

  currentRound++;


  let casesToOpen;


  if (
    currentRound <
    rounds.length
  ) {

    casesToOpen =
      rounds[currentRound];

  } else {

    casesToOpen =
      1;

  }


  const roundName =
    currentRound <
      rounds.length

      ? `Round ${currentRound + 1}`

      : "Final Round";


  // ------------------------------------------------------
  // NEXT ROUND MESSAGE
  // ------------------------------------------------------

  document.getElementById(
    "offerDetails"
  ).innerHTML = `

    <p class="message">
      CHANCE IT!
    </p>

    <p class="round-number">
      ${roundName}
    </p>

    <p class="cases-to-open">
      Choose
      <strong>${casesToOpen}</strong>
      more photo${casesToOpen === 1 ? "" : "s"}
      to reveal.
    </p>

  `;


  document.getElementById(
    "offerModal"
  ).style.display =
    "flex";


  // ------------------------------------------------------
  // KEEP NEXT-ROUND MESSAGE UP FOR 6 SECONDS
  // ------------------------------------------------------

  setTimeout(() => {

    document.getElementById(
      "offerModal"
    ).style.display =
      "none";


    renderBriefcases();


    updateSidePanels();


    const gameMessage =
      document.getElementById(
        "gameMessage"
      );


    if (gameMessage) {

      gameMessage.textContent =
        `Choose ${casesToOpen} photo${casesToOpen === 1 ? "" : "s"} to reveal.`;

    }


    offerActive =
      false;


    declineHandled =
      false;

  }, 6000);

}


// ======================================================
// PLAY AGAIN
// ======================================================

function playAgain() {

  window.location.reload();

}


// ======================================================
// ROUND / STARTING INSTRUCTION MODAL
// ======================================================

function showRoundModal(
  roundDisplay
) {

  let roundHTML;


  // ------------------------------------------------------
  // START OF GAME
  // ------------------------------------------------------

  if (
    roundDisplay === 1 &&
    !chosenBox
  ) {

    roundHTML = `

      <p class="message">
        WELCOME TO CASH IT OR CHANCE IT!
      </p>

      <p class="cases-to-open">
        Choose your pick to start the game.
      </p>

    `;

  } else {


    // ----------------------------------------------------
    // NORMAL ROUND ANNOUNCEMENT
    // ----------------------------------------------------

    const roundIndex =
      roundDisplay - 1;


    const casesToOpen =
      rounds[
        roundIndex
      ] ?? 1;


    roundHTML = `

      <p class="message">
        ROUND ${roundDisplay}
      </p>

      <p class="cases-to-open">

        Choose

        <strong>
          ${casesToOpen}
        </strong>

        photo${casesToOpen === 1 ? "" : "s"}
        to reveal.

      </p>

    `;

  }


  document.getElementById(
    "offerDetails"
  ).innerHTML =
    roundHTML;


  document.getElementById(
    "offerModal"
  ).style.display =
    "flex";


  // ------------------------------------------------------
  // STARTING INSTRUCTION
  // ------------------------------------------------------

  setTimeout(() => {

    document.getElementById(
      "offerModal"
    ).style.display =
      "none";


    const modalContent =
      document.querySelector(
        ".modal-content"
      );


    if (modalContent) {

      modalContent.classList.remove(
        "result-modal"
      );

    }


    if (!chosenBox) {

      const gameMessage =
        document.getElementById(
          "gameMessage"
        );


      if (gameMessage) {

        gameMessage.textContent =
          "Choose a photo to make your pick.";

      }

    }

  }, 5000);

}