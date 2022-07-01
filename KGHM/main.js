import hangmanImg1 from "/assets/1.png";
import hangmanImg2 from "/assets/2.png";
import hangmanImg3 from "/assets/3.png";
import hangmanImg4 from "/assets/4.png";
import hangmanImg5 from "/assets/5.png";
import hangmanImg6 from "/assets/6.png";
import hangmanImg7 from "/assets/7.png";
import hangmanImg8 from "/assets/8.png";
import hangmanImg9 from "/assets/9.png";
import hangmanImg10 from "/assets/10.png";
import hangmanImg11 from "/assets/fire.png";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const lifeArr = $(".carrot-life--wrapper"); //목숨
const wordArr = $(".words"); //단어ul
const hangmanImg = $(".hangman-img"); //이미지
const failModal = $(".fail-modal"); //실패 모달
const successModal = $(".success-modal"); //성공 모달

let answerWord = ""; //정답단어
let correctCnt = 0; //맞춘 단어개수
let chance = 10; // 카운트는 10
let imgCnt = 0; // 이미지 번째 수
let correctFlag = false; //정답이 있는지에 대한 flag
let status = ""; //최종 성공, 실패

const imageList = [
  hangmanImg1,
  hangmanImg2,
  hangmanImg3,
  hangmanImg4,
  hangmanImg5,
  hangmanImg6,
  hangmanImg7,
  hangmanImg8,
  hangmanImg9,
  hangmanImg10,
  hangmanImg11,
];

//단어받기 통신
const getWord = async () => {
  const response = await fetch("http://puzzle.mead.io/puzzle?wordCount=1");
  if (response.status === 200) {
    const data = await response.json();
    return data.puzzle.toLowerCase().split("");
  } else {
    throw new Error("unable to get puzzle");
  }
}

//단어 받아와서 길이 확인 후 단어 설정하기
const setWord = async () => {
  let word = await getWord(); //단어 받아오기
  while (word.length !== 7) {
    word = await getWord();
  }
  return word;
}

//사용자가 키를 누르면 해당 키가 정답을 맞추는 함수에 전달됨.
window.addEventListener("keydown", (e) => guessWord(e));

//시용자가 누른 단어가 있는 지 확인하기
const guessWord = (e) => {
  correctFlag = false;
  const userInput = e.key.toLowerCase();

  answerWord.forEach((element, idx) => {
    //사용자 입력이 맞는경우
    if (element === userInput) {
      const word = $$(".word");
      word[idx].innerHTML = `${element.toLowerCase()} &nbsp`;
      correctFlag = true;
      correctCnt++;

      if (correctCnt === 7) {
        status = "success";
        showModal();
      }
    }
  });

  //사용자 입력이 틀린 경우, chance--, imgcnt++
  if (!correctFlag) {
    chance--;
    imgCnt++;
    setKingmanImg();
    deleteLife();
  }
  //게임이 끝난 경우
  if (imgCnt === 10) {
    status = "fail";
    showModal();
  }
};

//모달을 보여주는 함수
const showModal = () => {
  status === "fail" ? failModal.classList.remove("hide") : successModal.classList.remove("hide");
};

//목숨 이미지를 틀린횟수만큼 지우기
const deleteLife = () => {
  const element = $(".carrot-life");
  element.parentNode.removeChild(element);
};

//킹맨 이미지를 틀린횟수에 따라 바꾸기
const setKingmanImg = () => {
  hangmanImg.src = imageList[imgCnt];
}

//단어 받아오는 곳 초기화하는 곳!
const setWordSection = async () => {
  for (let i = 0; i < 7; i++) {
    const li = document.createElement("li");
    li.className = "word";
    li.innerHTML = "_&nbsp";
    wordArr.appendChild(li);
  }
}

//목숨생성하기
const setLife = async () => {
  for (let i = 0; i < 10; i++) {
    const img = document.createElement("img");
    img.setAttribute("src", "/assets/carrot.png");
    lifeArr.appendChild(img);
  }
};

//게임 초기화
const init = async () => {
  answerWord = await setWord(); //단어 새로 받아오고
  chance = 10; //기회 10으로 초기화
  imgCnt = 0; //이미지 카운트는 0으로 초기화
  setWordSection(); //워드섹션 만들기
  setKingmanImg(); //이미지 바꾸기
  setLife(); //목숨 생성하고 이미지 넣기
};

window.onload = () => {
  init();
};
