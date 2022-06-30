import hangmanImg1 from "./public/assets/1.png";
import hangmanImg2 from "./public/assets/2.png";
import hangmanImg3 from "./public/assets/3.png";
import hangmanImg4 from "./public/assets/4.png";
import hangmanImg5 from "./public/assets/5.png";
import hangmanImg6 from "./public/assets/6.png";
import hangmanImg7 from "./public/assets/7.png";
import hangmanImg8 from "./public/assets/8.png";
import hangmanImg9 from "./public/assets/9.png";
import hangmanImg10 from "./public/assets/10.png";
import hangmanImg11 from "./public/assets/fire.png";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const lifeArr = $$(".life-wrapper"); //목숨
const wordArr = $(".words"); //단어ul
const hangmanImg = $(".hangman-img"); //이미지
const failModal = $(".fail-modal"); //실패 모달
const successModal = $(".success-modal"); //실패 모달

let answerWord = ""; //정답단어
let chance = 10; // 카운트는 10
let imageCount = 0; // 이미지 번째 수
let status = ""; //성공, 실패

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
async function getWord() {
  const response = await fetch("http://puzzle.mead.io/puzzle?wordCount=1");
  if (response.status === 200) {
    const data = await response.json();
    return data.puzzle.toLowerCase().split("");
  } else {
    throw new Error("unable to get puzzle");
  }
}

//단어 받아와서 길이 확인 후 단어 설정하기
async function setWord() {
  let word = await getWord(); //단어 받아오기
  while (word.length != 7) {
    word = await getWord();
  }
  return word;
}

//사용자가 키를 누르면 해당 키가 정답을 맞추는 함수에 전달됨.
window.addEventListener("keydown", (e) => guessWord(e));

//시용자가 누른 단어가 있는 지 확인하기
const guessWord = (e) => {
  console.log(">>>단어", answerWord);
  const userInput = e.key.toLowerCase();
  console.log(">>>>>>사용자 입력", userInput);
};

//모달을 보여주는 함수
function showModal() {
  if (status == "fail") {
    failModal.remove("hide");
  } else if (status == "success") {
    successModal.remove("hide");
  }
}

//이미지를 틀린횟수에 따라 바꾸기
function setKingmanImg() {
  hangmanImg.src = imageList[imageCount];
}

//단어 받아오는 곳 초기화하는 곳!
async function setWordSection() {
  for (let i = 0; i < 7; i++) {
    const li = document.createElement("li");
    li.className = "word";
    li.innerHTML = "_";
    wordArr.appendChild(li);
  }
}

//게임 초기화
const init = async () => {
  answerWord = await setWord(); //단어 새로 받아오고
  chance = 10; //기회 10으로 초기화
  imageCount = 0; //이미지 카운트는 0으로 초기화
  setWordSection(); //워드섹션 만들기
  setKingmanImg(); //이미지 바꾸기
};

window.onload = () => {
  init();
};
