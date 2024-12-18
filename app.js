// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBGpjo5MUAs3OJa5h-DAZ4HvaEyq4IE7AY",
    authDomain: "snupool.firebaseapp.com",
    databaseURL: "https://snupool.firebaseio.com",
  };
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // 투표 제출
  document.getElementById('voteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const choice = document.querySelector('input[name="choice"]:checked').value;
    if (choice) {
      db.ref('votes').push({ choice });
      alert('투표가 제출되었습니다!');
    }
  });
  
  // 실시간 결과 업데이트
  db.ref('votes').on('value', (snapshot) => {
    const results = {};
    snapshot.forEach((child) => {
      const choice = child.val().choice;
      results[choice] = (results[choice] || 0) + 1;
    });
  
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";
    for (const [choice, count] of Object.entries(results)) {
      resultsDiv.innerHTML += `<p>${choice}: ${count}표</p>`;
    }
  });
  