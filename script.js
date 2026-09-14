/* ==========================================================
   WEIGHTED LEXICON-BASED SENTIMENT ANALYSIS
   Wisata Pantai Sumba Barat Daya

   Rumus utama:
   S0 = ΣP + ΣN
   Sc = S0 + Aneg + Aint
   FinalScore = Sc × Fk × Fi

   Catatan:
   - Indikator netral dicatat, tetapi tidak masuk skor polaritas.
   - Negasi dan intensifier mengikuti logika kode dasar repository.
   - Fk dan Fi mempertahankan aturan yang sudah tertanam sebelumnya.
   ========================================================== */

const positiveIndicators = [
  ["indah",3],["bagus",2],["cantik",3],["bersih",3],["nyaman",3],["ramah",3],["asri",3],["keren",3],["mantap",3],
  ["menarik",2],["memuaskan",3],["luar biasa",4],["rekomendasi",3],["recommended",3],["sunset",2],["sunrise",2],
  ["jernih",3],["alami",2],["aman",3],["terawat",3],["menyenangkan",3],["eksotis",3],["puas",3],["suka",2],
  ["tenang",2],["sejuk",2],["menawan",3],["fotogenik",2],["instagramable",2],["murah",2],["mudah",2],["tertata",3],
  ["baik",2],["favorit",2],["memikat",3],["menakjubkan",4],["spektakuler",4],["bersahabat",2],["elok",3],["permai",3],
  ["meneduhkan",2],["damai",2],["adem",2],["hijau",1],["biru",1],["pasir putih",3],["air laut jernih",4],["ombak tenang",3],
  ["pemandangan indah",4],["view bagus",3],["spot foto",2],["spot foto bagus",3],["cocok untuk keluarga",3],["cocok untuk healing",3],
  ["cocok untuk liburan",3],["cocok untuk piknik",2],["anak anak aman",3],["parkir luas",2],["toilet bersih",3],["warung tersedia",2],
  ["harga terjangkau",3],["akses mudah",3],["jalan bagus",3],["jalan mulus",3],["petugas ramah",3],["warga ramah",3],["masyarakat ramah",3],
  ["pelayanan baik",3],["fasilitas lengkap",3],["fasilitas memadai",3],["lokasi strategis",2],["dekat bandara",1],["suasana alami",3],
  ["alam masih asli",3],["tidak terlalu ramai",2],["tenang sekali",3],["layak dikunjungi",3],["wajib dikunjungi",4],["destinasi terbaik",4],
  ["pengalaman berkesan",4],["pengalaman menyenangkan",4],["sangat puas",4],["sangat indah",4],["sangat bagus",3],["sangat bersih",4],
  ["sangat nyaman",4],["sangat ramah",4],["pantai cantik",3],["pantai bersih",3],["pantai indah",4],["laut biru",2],["laut jernih",3],
  ["pasir halus",2],["udara segar",2],["pemandangan memukau",4],["panorama indah",4],["tebing indah",3],["karang indah",2],
  ["bagus untuk foto",3],["nyaman untuk bersantai",3],["tidak mengecewakan",3],["tidak buruk",2],["tidak mahal",2],["tidak kotor",3],
  ["tidak ramai",2],["tidak macet",2],["terima kasih",1],["ingin kembali",3],["akan kembali",3],["repeat visit",3]
];

const negativeIndicators = [
  ["kotor",-3],["buruk",-3],["rusak",-3],["sampah",-3],["jelek",-3],["mahal",-2],["kecewa",-3],["macet",-2],["panas",-1],
  ["ramai",-1],["bau",-3],["sulit",-2],["berbahaya",-3],["rawan",-3],["licin",-2],["pungli",-4],["mengecewakan",-4],
  ["parah",-3],["jauh",-1],["sepi",-1],["berdebu",-2],["becek",-2],["kumuh",-4],["jorok",-4],["tidak nyaman",-4],
  ["tidak aman",-4],["tidak bersih",-4],["tidak terawat",-4],["tidak ramah",-3],["tidak tertata",-3],["tidak layak",-4],
  ["akses buruk",-4],["akses jalan buruk",-4],["jalan rusak",-4],["jalan jelek",-4],["jalan berbatu",-2],["jalan sulit",-3],
  ["jalan sempit",-2],["akses sulit",-3],["akses jauh",-2],["fasilitas kurang",-3],["minim fasilitas",-3],["fasilitas minim",-3],
  ["fasilitas rusak",-4],["toilet kotor",-4],["toilet rusak",-4],["parkir sempit",-2],["parkir mahal",-2],["harga mahal",-3],
  ["retribusi mahal",-3],["biaya mahal",-3],["tiket mahal",-3],["tidak ada toilet",-3],["tidak ada tempat sampah",-3],
  ["banyak sampah",-4],["sampah plastik",-3],["area kotor",-3],["pantai kotor",-4],["air keruh",-3],["ombak besar",-2],
  ["kurang aman",-3],["kurang nyaman",-3],["kurang bersih",-3],["kurang terawat",-3],["kurang tertata",-2],["belum memadai",-2],
  ["belum terkelola",-3],["pengelolaan buruk",-4],["pelayanan buruk",-4],["petugas tidak ramah",-4],["warga tidak ramah",-3],
  ["menyesal",-4],["kapok",-4],["tidak rekomendasi",-4],["tidak recommended",-4],["tidak cocok",-3],["tidak puas",-4],
  ["sangat kecewa",-5],["sangat kotor",-5],["sangat mahal",-4],["sangat buruk",-5],["sangat tidak nyaman",-5],
  ["terlalu ramai",-3],["terlalu mahal",-4],["terlalu jauh",-2],["kurang menarik",-2],["biasa saja",-1],["tidak sesuai ekspektasi",-4],
  ["banyak pungli",-5],["biaya tidak jelas",-4],["tidak transparan",-3],["rawan kecelakaan",-4],["tidak ada penerangan",-3],
  ["gelap",-2],["sinyal susah",-1],["tidak ada jaringan",-1],["warung mahal",-2],["makanan mahal",-2],["harga tidak wajar",-4]
];

const neutralIndicators = [
  ["biasa",1],["biasa saja",2],["cukup",1],["cukup baik",1],["cukup bagus",1],["cukup bersih",1],["lumayan",1],
  ["standar",1],["sedang",1],["normal",1],["secukupnya",1],["apa adanya",1],["tidak terlalu",1],["cukup ramai",1],
  ["cukup sepi",1],["cukup jauh",1],["sekadar lewat",1],["hanya melihat",1],["belum banyak berubah",1],["informasi",1],
  ["lokasi",1],["alamat",1],["rute",1],["perjalanan",1],["jam buka",1],["tiket masuk",1],["biaya masuk",1],
  ["parkir",1],["pantai kecil",1],["pantai ini",1],["tempat ini",1],["tergantung",1],["relatif",1],["campuran",1],
  ["ada positif dan negatif",2],["ada kelebihan dan kekurangan",2],["tidak buruk tetapi",2],["bagus tetapi",2],["indah namun",2],
  ["bersih tetapi",2],["cukup memadai",1],["perlu ditingkatkan",1],["masih perlu diperbaiki",1]
];

const negationWords = ["tidak","bukan","tak","belum","kurang"];
const intensifiers = ["sangat","sekali","amat","paling","benar","benar-benar","begitu","terlalu"];

function preprocess(text){
  return text
    .toLowerCase()
    .replace(/[.,!?;:()"'_\-]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function countOccurrences(text, phrase){
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`,"g");
  return (text.match(regex) || []).length;
}

function formatSignedWeight(weight){
  return weight > 0 ? `+${weight}` : `${weight}`;
}

function formatNumber(value, digits=2){
  return Number(value).toLocaleString("id-ID",{
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function formatSignedNumber(value, digits=2){
  const n = Number(value);
  if(n > 0) return `+${formatNumber(n,digits)}`;
  return formatNumber(n,digits);
}

/*
   scan() mempertahankan perhitungan asli:
   score += weight × jumlah kemunculan
   Perubahan hanya menambahkan metadata tampilan bobot.
*/
function scan(text, list, showWeight=true){
  let score = 0;
  let count = 0;
  let matches = [];

  list.forEach(([term,weight]) => {
    const found = countOccurrences(text,term);
    if(found > 0){
      score += weight * found;
      count += found;

      if(showWeight){
        const contribution = weight * found;
        matches.push(
          `${term} (${found}) — bobot ${formatSignedWeight(weight)}; kontribusi ${formatSignedWeight(contribution)}`
        );
      }else{
        matches.push(`${term} (${found})`);
      }
    }
  });

  return {score,count,matches};
}

function analyzeSentiment(){
  const raw = document.getElementById("commentInput").value;
  const text = preprocess(raw);

  if(!text){
    alert("Silakan masukkan komentar terlebih dahulu.");
    return;
  }

  const words = text.split(" ");

  /* =========================
     1. LEXICON MATCHING
     ========================= */
  const pos = scan(text,positiveIndicators,true);
  const neg = scan(text,negativeIndicators,true);
  const neu = scan(text,neutralIndicators,false);

  const positiveLexiconScore = pos.score;  // ΣP
  const negativeLexiconScore = neg.score;  // ΣN
  const baseScore = positiveLexiconScore + negativeLexiconScore; // S0

  let score = baseScore;

  /* Mempertahankan hitungan indikator dari kode dasar. */
  let positiveCount = pos.count;
  let negativeCount = neg.count;
  const neutralCount = neu.count;

  const positiveMatches = [...pos.matches];
  const negativeMatches = [...neg.matches];
  const neutralMatches = [...neu.matches];

  /* =========================
     2. CONTEXT ADJUSTMENT
     ========================= */
  let negationAdjustment = 0;     // Aneg
  let intensifierAdjustment = 0;  // Aint
  const contextOperations = [];

  words.forEach((word,i) => {
    const prev = words[i-1] || "";
    const prev2 = words[i-2] || "";

    const posSingle = positiveIndicators.find(x => x[0] === word);
    const negSingle = negativeIndicators.find(x => x[0] === word);

    /* Negasi terhadap kata positif:
       contoh: menyenangkan +3 -> "kurang menyenangkan"
       koreksi = -(abs(3) × 2) = -6
       efektif: +3 - 6 = -3
    */
    if(posSingle && negationWords.includes(prev)){
      const adjustment = -(Math.abs(posSingle[1]) * 2);
      score += adjustment;
      negationAdjustment += adjustment;
      negativeCount++;

      contextOperations.push({
        type: "Negasi terhadap indikator positif",
        expression: `${prev} ${word}`,
        baseWeight: posSingle[1],
        adjustment,
        effectiveWeight: posSingle[1] + adjustment,
        detail: `${formatSignedNumber(posSingle[1])} ${adjustment < 0 ? "−" : "+"} ${formatNumber(Math.abs(adjustment))} = ${formatSignedNumber(posSingle[1] + adjustment)}`
      });
    }

    /* Negasi terhadap kata negatif:
       contoh: buruk -3 -> "tidak buruk"
       koreksi = +(abs(-3) × 2) = +6
       efektif: -3 + 6 = +3
    */
    if(negSingle && negationWords.includes(prev)){
      const adjustment = Math.abs(negSingle[1]) * 2;
      score += adjustment;
      negationAdjustment += adjustment;
      positiveCount++;

      contextOperations.push({
        type: "Negasi terhadap indikator negatif",
        expression: `${prev} ${word}`,
        baseWeight: negSingle[1],
        adjustment,
        effectiveWeight: negSingle[1] + adjustment,
        detail: `${formatSignedNumber(negSingle[1])} + ${formatNumber(adjustment)} = ${formatSignedNumber(negSingle[1] + adjustment)}`
      });
    }

    /* Intensifier positif: +45% dari bobot absolut. */
    if(posSingle && (intensifiers.includes(prev) || intensifiers.includes(prev2))){
      const intensifier = intensifiers.includes(prev) ? prev : prev2;
      const adjustment = Math.abs(posSingle[1]) * 0.45;
      score += adjustment;
      intensifierAdjustment += adjustment;

      contextOperations.push({
        type: "Intensifier positif",
        expression: `${intensifier} ${word}`,
        baseWeight: posSingle[1],
        adjustment,
        effectiveWeight: posSingle[1] + adjustment,
        detail: `${formatSignedNumber(posSingle[1])} + (45% × ${formatNumber(Math.abs(posSingle[1]))}) = ${formatSignedNumber(posSingle[1] + adjustment)}`
      });
    }

    /* Intensifier negatif: -45% dari bobot absolut. */
    if(negSingle && (intensifiers.includes(prev) || intensifiers.includes(prev2))){
      const intensifier = intensifiers.includes(prev) ? prev : prev2;
      const adjustment = -(Math.abs(negSingle[1]) * 0.45);
      score += adjustment;
      intensifierAdjustment += adjustment;

      contextOperations.push({
        type: "Intensifier negatif",
        expression: `${intensifier} ${word}`,
        baseWeight: negSingle[1],
        adjustment,
        effectiveWeight: negSingle[1] + adjustment,
        detail: `${formatSignedNumber(negSingle[1])} − (45% × ${formatNumber(Math.abs(negSingle[1]))}) = ${formatSignedNumber(negSingle[1] + adjustment)}`
      });
    }
  });

  const contextScore = score; // Sc

  /* =========================
     3. FAKTOR PANJANG KOMENTAR (Fk)
     Mempertahankan logika kode dasar:
     >40 kata  -> ×1.15
     >80 kata  -> juga ×1.32
     sehingga >80 kata = 1.15 × 1.32 = 1.518
     ========================= */
  const wordCount = words.length;
  let Fk = 1.00;
  let fkExplanation = "Jumlah kata ≤ 40, sehingga Fk = 1,00.";

  if(wordCount > 40){
    Fk *= 1.15;
    fkExplanation = `Jumlah kata ${wordCount} > 40, sehingga Fk = 1,15.`;
  }

  if(wordCount > 80){
    Fk *= 1.32;
    fkExplanation = `Jumlah kata ${wordCount} > 80. Sesuai kode dasar: Fk = 1,15 × 1,32 = ${formatNumber(Fk,3)}.`;
  }

  /* =========================
     4. FAKTOR JUMLAH INDIKATOR (Fi)
     ========================= */
  let Fi = 1.00;
  const sentimentIndicatorCount = positiveCount + negativeCount;
  let fiExplanation = `Jumlah indikator positif + negatif = ${sentimentIndicatorCount} < 8, sehingga Fi = 1,00.`;

  if(sentimentIndicatorCount >= 8){
    Fi = 1.08;
    fiExplanation = `Jumlah indikator positif + negatif = ${sentimentIndicatorCount} ≥ 8, sehingga Fi = 1,08.`;
  }

  /* =========================
     5. FINAL SCORE
     ========================= */
  const finalScore = contextScore * Fk * Fi;

  /* =========================
     6. KLASIFIKASI THRESHOLD
     ========================= */
  let label = "NETRAL";
  let interpretation = "Komentar ini cenderung netral, informatif, atau menunjukkan keseimbangan antara pengalaman positif dan negatif.";

  if(finalScore >= 2.5){
    label = "POSITIF";
    interpretation = "Komentar ini dominan positif. Wisatawan cenderung memberikan evaluasi positif terhadap daya tarik pantai, suasana, kebersihan, keramahan, akses, fasilitas, atau pengalaman wisata secara umum.";
  }else if(finalScore <= -2.5){
    label = "NEGATIF";
    interpretation = "Komentar ini dominan negatif. Wisatawan menyoroti keluhan seperti kebersihan, akses jalan, fasilitas, harga, keamanan, pelayanan, atau pengelolaan destinasi.";
  }else if(sentimentIndicatorCount >= 4){
    interpretation = "Komentar ini bersifat campuran. Terdapat apresiasi sekaligus keluhan, tetapi skor akhir belum melewati threshold positif maupun negatif.";
  }

  const calculation = {
    positiveLexiconScore,
    negativeLexiconScore,
    baseScore,
    negationAdjustment,
    intensifierAdjustment,
    contextScore,
    Fk,
    Fi,
    finalScore,
    fkExplanation,
    fiExplanation,
    contextOperations
  };

  renderResult(
    label,
    finalScore,
    positiveCount,
    negativeCount,
    neutralCount,
    wordCount,
    positiveMatches,
    negativeMatches,
    neutralMatches,
    interpretation,
    calculation
  );
}

function renderResult(
  label,
  score,
  pos,
  neg,
  neu,
  words,
  posTerms,
  negTerms,
  neuTerms,
  interp,
  calculation
){
  const box = document.getElementById("resultBox");
  const bar = document.getElementById("barFill");
  const badge = document.getElementById("badgeResult");

  box.classList.remove("hidden");

  document.getElementById("sentimentLabel").textContent = label;
  document.getElementById("sentimentScore").textContent = formatNumber(score,2);
  document.getElementById("positiveCount").textContent = pos;
  document.getElementById("negativeCount").textContent = neg;
  document.getElementById("neutralCount").textContent = neu;
  document.getElementById("wordCount").textContent = words;

  document.getElementById("positiveTerms").textContent = posTerms.length ? posTerms.join("; ") : "-";
  document.getElementById("negativeTerms").textContent = negTerms.length ? negTerms.join("; ") : "-";
  document.getElementById("neutralTerms").textContent = neuTerms.length ? neuTerms.join("; ") : "-";
  document.getElementById("interpretationText").textContent = interp;

  /* Bar visual mempertahankan logika kode dasar. */
  const width = Math.min(100,Math.max(10,Math.abs(score) * 7));
  bar.style.width = width + "%";

  if(label === "POSITIF"){
    box.style.borderLeftColor = "#2a9d8f";
    bar.style.background = "#2a9d8f";
    badge.textContent = "Dominan Positif";
  }else if(label === "NEGATIF"){
    box.style.borderLeftColor = "#e63946";
    bar.style.background = "#e63946";
    badge.textContent = "Dominan Negatif";
  }else{
    box.style.borderLeftColor = "#6c757d";
    bar.style.background = "#6c757d";
    badge.textContent = "Netral/Campuran";
  }

  /* =========================
     DETAIL OPERASI PERHITUNGAN
     ========================= */
  document.getElementById("calcPositiveScore").textContent = formatSignedNumber(calculation.positiveLexiconScore);
  document.getElementById("calcNegativeScore").textContent = formatSignedNumber(calculation.negativeLexiconScore);
  document.getElementById("calcBaseScore").textContent = formatSignedNumber(calculation.baseScore);
  document.getElementById("calcNegation").textContent = formatSignedNumber(calculation.negationAdjustment);
  document.getElementById("calcIntensifier").textContent = formatSignedNumber(calculation.intensifierAdjustment);
  document.getElementById("calcContextScore").textContent = formatSignedNumber(calculation.contextScore);
  document.getElementById("calcFk").textContent = formatNumber(calculation.Fk,3);
  document.getElementById("calcFi").textContent = formatNumber(calculation.Fi,2);
  document.getElementById("calcFkExplanation").textContent = calculation.fkExplanation;
  document.getElementById("calcFiExplanation").textContent = calculation.fiExplanation;

  document.getElementById("calcFormula").textContent =
    `FinalScore = (${formatSignedNumber(calculation.contextScore)}) × ${formatNumber(calculation.Fk,3)} × ${formatNumber(calculation.Fi,2)} = ${formatSignedNumber(calculation.finalScore)}`;

  let thresholdText;
  if(calculation.finalScore >= 2.5){
    thresholdText = `${formatSignedNumber(calculation.finalScore)} ≥ +2,50 → POSITIF`;
  }else if(calculation.finalScore <= -2.5){
    thresholdText = `${formatSignedNumber(calculation.finalScore)} ≤ −2,50 → NEGATIF`;
  }else{
    thresholdText = `−2,50 < ${formatSignedNumber(calculation.finalScore)} < +2,50 → NETRAL`;
  }
  document.getElementById("calcThreshold").textContent = thresholdText;

  const contextList = document.getElementById("contextCalculationList");
  contextList.innerHTML = "";

  if(calculation.contextOperations.length === 0){
    const li = document.createElement("li");
    li.textContent = "Tidak terdapat penyesuaian konteks negasi atau intensifier.";
    contextList.appendChild(li);
  }else{
    calculation.contextOperations.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.type}: “${item.expression}” | bobot dasar ${formatSignedNumber(item.baseWeight)} | penyesuaian ${formatSignedNumber(item.adjustment)} | bobot efektif ${formatSignedNumber(item.effectiveWeight)} | operasi: ${item.detail}`;
      contextList.appendChild(li);
    });
  }

  box.scrollIntoView({behavior:"smooth",block:"start"});
}

function loadSample(type){
  const samples = {
    positive:"Pantai Mandorak sangat indah dan menakjubkan. Air lautnya jernih, pasir putihnya bersih, suasananya tenang, dan pemandangan sunset sangat cantik. Warga sekitar ramah, tempatnya aman, serta sangat cocok untuk keluarga dan healing. Walaupun perjalanan cukup jauh, pengalaman berkunjung sangat memuaskan dan saya ingin kembali.",
    negative:"Pemandangan pantai sebenarnya bagus, tetapi pengalaman berkunjung cukup mengecewakan. Akses jalan buruk dan rusak, fasilitas minim, toilet kotor, banyak sampah plastik di area parkir, serta biaya masuk terasa mahal. Lokasi kurang tertata dan pengelolaan buruk sehingga pengunjung merasa tidak nyaman.",
    neutral:"Pantai ini berada di wilayah Sumba Barat Daya. Perjalanan menuju lokasi cukup jauh dan membutuhkan kendaraan yang sesuai. Tempatnya tidak terlalu ramai saat pagi hari. Fasilitas tersedia secukupnya dan pengunjung biasanya datang untuk melihat pemandangan serta mengambil foto.",
    mixed:"Pantai ini memiliki pemandangan yang sangat indah, air laut jernih, pasir putih, dan suasana nyaman untuk menikmati sunset. Namun akses jalan menuju lokasi masih buruk, fasilitas belum memadai, dan ada beberapa sampah di sekitar area parkir. Walaupun begitu, masyarakat sekitar cukup ramah dan panorama pantainya tetap menarik."
  };

  document.getElementById("commentInput").value = samples[type];
}

function clearText(){
  document.getElementById("commentInput").value = "";
  document.getElementById("resultBox").classList.add("hidden");
}
