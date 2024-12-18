// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBGpjo5MUAs3OJa5h-DAZ4HvaEyq4IE7AY",
    authDomain: "snupool.firebaseapp.com",
    databaseURL: "https://snupool.firebaseio.com",
  };
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // 페이지 제목에 이번 주 토요일 날짜 표시
  function getSaturdayDate() {
    const today = new Date();
    const day = today.getDay();
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + (6 - day)); // 이번 주 토요일
    return `${saturday.getFullYear()}년 ${saturday.getMonth() + 1}월 ${saturday.getDate()}일`;
  }
  document.getElementById("mainTitle").innerText = `${getSaturdayDate()} 정기모임 투표`;
  
  // 투표 제출 처리
  document.getElementById("voteForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("nameInput").value;
    const level = document.getElementById("levelSelect").value;
  
    const levelRef = db.ref(`votes/${level}`);
  
    levelRef.once("value").then((snapshot) => {
      const data = snapshot.val() || { count: 0, participants: [] };
  
      if (data.count >= 3) {
        alert(`${level}는 이미 정원이 가득 찼습니다!`);
        return;
      }
  
      data.count += 1;
      data.participants.push(name);
  
      levelRef.set(data).then(() => {
        alert("투표가 제출되었습니다!");
        document.getElementById("voteForm").reset();
      });
    });
  });
  
  // 실시간 신청 현황 표시
  function updateResults() {
    db.ref("votes").on("value", (snapshot) => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
  
      const levels = ["초급", "중급", "상급"];
      levels.forEach((level) => {
        const data = snapshot.val()?.[level] || { count: 0, participants: [] };
        const colorClass = data.count > 3 ? "overquota" : "current";
        resultsDiv.innerHTML += `
          <h3>${level} (<span class="${colorClass}">${data.count}</span>/3명)</h3>
          <ol>${data.participants.map((p) => `<li>${p}</li>`).join("")}</ol>
        `;
      });
    });
  }
  updateResults();
  
  // 매주 일요일에 데이터 리셋 (서버 타임존 기준)
  function resetVotes() {
    const now = new Date();
    const day = now.getDay();
    if (day === 0) { // 일요일
      db.ref("votes").set({
        초급: { count: 0, participants: [] },
        중급: { count: 0, participants: [] },
        상급: { count: 0, participants: [] }
      });
    }
  }
  resetVotes();
  