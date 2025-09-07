const createElement = (arr)=>{
 const htmlElement = arr.map((el)=> `<span class="btn">${el}</span>`);
 return htmlElement.join(" ");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status)=> {
    if(status==true){
        document.getElementById("spinner").classList.remove('hidden');
        document.getElementById("word-container").classList.add('hidden');
    }
    else{
        document.getElementById("word-container").classList.remove('hidden');
        document.getElementById("spinner").classList.add('hidden');
    }
}

const loadLessons =()=> {
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res=> res.json())
    .then(JSON=> displayLessons(JSON.data));
};

const removeActive = ()=> {
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    //console.log(lessonButtons)
    lessonButtons.forEach((btn)=> btn.classList.remove("active"));
}

const loadLevelWord =(id)=>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res=> res.json())
    .then((data) =>{
        removeActive()
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        //console.log(clickBtn)
        clickBtn.classList.add("active");
        displayLevelWord(data.data)
    });
};

const loadWordDetail = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    //console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetail(details.data);
};

const displayWordDetail = (word) =>{
    console.log(word)
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
    <div class="">
      <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
    </div>
    <div class="">
      <h2 class="font-bold">meaning</h2>
      <p>${word.meaning}</p>
    </div>
    <div class="">
      <h2 class="font-bold">Example</h2>
      <p>${word.sentence} </p>
    </div>
    <div class="">
      <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
      <div class="">${createElement(word.synonyms)} </div>
      </div>
    
    `
    
    document.getElementById('word_modal').showModal();
}

const displayLevelWord=(words)=>{
  
 const wordContainer = document.getElementById('word-container');
 wordContainer.innerHTML = "";

 if(words.length == 0){
    wordContainer.innerHTML = `
    <div class="text-center  col-span-full rounded-xl py-10 space-y-6 font-bangla">
    <img class="mx-auto" src="./assets/alert-error.png" alt="">
    <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
   <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান।</h2>
   </div>
    
    `; 
    manageSpinner(false);
    return;
 }
 words.forEach(word => {
     //console.log(word);
    const card = document.createElement('div');
    card.innerHTML =`
    <div class="bg-white rounded-xl shadow-sm text-center py-12 px-5 space-y-4">
    <h2 class="font-bold text-2xl">${word.word ? word.word: 'শব্দ পাওয়া যায়নি।'}</h2>
    <p class="font-semibold">Meaning /Pronounciation</p>
    <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning :'অর্থ পাওয়া যায়নি।'} /${word.pronunciation ?word.pronunciation :'Pronounciation অর্থ পাওয়া যায়নি।'} "</div>
    <div class="flex justify-between items-center pt-5">
      <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
      <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
    </div>
   </div>
    `;
    wordContainer.append(card);
 });
 manageSpinner(false);
}

const displayLessons=(lessons)=>{
const levelContainer = document.getElementById('level-container')
levelContainer.innerHTML = "";
for (let lesson of lessons){
    //console.log(lesson)
    const btnDiv = document.createElement('div')
    btnDiv.innerHTML = `
                  <button id="lesson-btn-${lesson.level_no}" onclick= "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary text-[#422AD5] lesson-btn">
                  <i class="fa-solid fa-book-open"></i>Lesson -${lesson.level_no}
                  </button>

    `;
    levelContainer.append(btnDiv)
}
};
loadLessons()

document.getElementById('btn-search').addEventListener('click', ()=>{
    removeActive();
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
   // console.log(searchValue);

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res=>res.json())
    .then(data=>{
        const allWords = data.data;
        //console.log(allWords);
        const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    });
})