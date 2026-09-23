// ======================================================
// RENDER PHOTO PICKS
// ======================================================

function renderBriefcases() {

  const container =
    document.getElementById("briefcasesContainer");

  if (!container) return;

  container.innerHTML = "";


  boxes.forEach(box => {

    const briefcase =
      document.createElement("div");

    briefcase.className =
      "briefcase";

    briefcase.id =
      "briefcase-" + box;


    // --------------------------------------------------
    // PERSONAL PICK
    // --------------------------------------------------

    if (box === chosenBox) {

      briefcase.innerHTML = `
        <img
          class="briefcase-img"
          src="${boxImages[box]}"
          alt="Personal pick ${box}"
        >

        <div class="briefcase-number">
          ${box}
        </div>
      `;

      briefcase.classList.add("personal");

    }


    // --------------------------------------------------
    // OPENED / REVEALED PICK
    // --------------------------------------------------

    else if (openedStatus[box]) {

      briefcase.innerHTML = `
        <img
          class="briefcase-img"
          src="${boxImages[box]}"
          alt="Revealed photo ${box}"
        >

        <div class="briefcase-number">
          $${boxValues[box].toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </div>
      `;

      briefcase.classList.add("opened");

    }


    // --------------------------------------------------
    // AVAILABLE PICK
    // --------------------------------------------------

    else {

      briefcase.innerHTML = `
        <img
          class="briefcase-img"
          src="${boxImages[box]}"
          alt="Photo ${box}"
        >

        <div class="briefcase-number">
          ${box}
        </div>
      `;


      if (!finalSwapActive) {

        briefcase.onclick = function () {

          if (offerActive) return;

          if (
            openedStatus[box] ||
            box === chosenBox
          ) {
            return;
          }

          playSound("clickSound");

          briefcaseClicked(box);

        };

      }

    }


    container.appendChild(briefcase);

  });


  // ----------------------------------------------------
  // FINAL SWAP CHECK
  // ----------------------------------------------------

  const unopened =
    boxes.filter(
      b =>
        !openedStatus[b] &&
        b !== chosenBox
    );


  if (
    unopened.length === 1 &&
    !finalSwapActive
  ) {

    setTimeout(() => {
      finalSwap();
    }, 500);

  }

}



// ======================================================
// PRIZE BOARD
// ======================================================

function updatePrizeBoard() {

  const prizeBoard =
    document.getElementById("prizeBoard");

  if (!prizeBoard) return;


  prizeBoard.innerHTML = "";


  const sortedPrizes =
    [...prizes].sort(
      (a, b) => a - b
    );


  const half =
    Math.ceil(
      sortedPrizes.length / 2
    );


  const leftPrizes =
    sortedPrizes.slice(0, half);

  const rightPrizes =
    sortedPrizes.slice(half);



  // ----------------------------------------------------
  // CREATE COLUMN
  // ----------------------------------------------------

  function createPrizeColumn(
    prizeList,
    className
  ) {

    const column =
      document.createElement("ul");

    column.className =
      `prize-column ${className}`;


    prizeList.forEach(prize => {

      const li =
        document.createElement("li");


      const pumpkin =
        document.createElement("span");

      pumpkin.className =
        "prize-pumpkin";

      pumpkin.textContent =
        "🎃";


      const amount =
        document.createElement("span");

      amount.className =
        "prize-amount";

      amount.textContent =
        "$" +
        prize.toLocaleString(
          undefined,
          {
            minimumFractionDigits:
              prize < 1 ? 2 : 0,

            maximumFractionDigits:
              prize < 1 ? 2 : 0
          }
        );


      li.appendChild(pumpkin);
      li.appendChild(amount);


      if (
        !valuesRemaining.includes(prize)
      ) {

        li.classList.add(
          "eliminated"
        );

      }


      column.appendChild(li);

    });


    return column;

  }



  prizeBoard.appendChild(
    createPrizeColumn(
      leftPrizes,
      "left-column"
    )
  );


  prizeBoard.appendChild(
    createPrizeColumn(
      rightPrizes,
      "right-column"
    )
  );

}



// ======================================================
// OFFER HISTORY
// ======================================================

function updateOffersHistory() {

  const historyList =
    document.getElementById(
      "offersHistory"
    );

  if (!historyList) return;


  historyList.innerHTML = "";


  offersHistory.forEach(
    (offer, index) => {

      const li =
        document.createElement("li");

      li.innerHTML = `
        <span class="offer-label">
          Offer ${index + 1}
        </span>

        <span class="offer-value">
          $${offer.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </span>
      `;

      historyList.appendChild(li);

    }
  );

}



// ======================================================
// SIDE PANELS
// ======================================================

function updateSidePanels() {

  updatePrizeBoard();

  updateOffersHistory();

}



// ======================================================
// ROUND INDICATOR
// ======================================================

function updateRoundIndicator() {

  const roundIndicator =
    document.getElementById(
      "roundIndicator"
    );


  if (roundIndicator) {

    roundIndicator.textContent =
      "Round: " +
      (currentRound + 1);

  }

}



// ======================================================
// GAME MESSAGE AREA
// ======================================================

function updateGameArea(
  htmlContent
) {

  const gameArea =
    document.getElementById(
      "briefcasesInfo"
    );


  if (gameArea) {

    gameArea.innerHTML =
      htmlContent;

  }


  updateSidePanels();

}