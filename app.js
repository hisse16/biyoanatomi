import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const organData = {
  mouth:["Ağız","Dişler besinleri küçük parçalara ayırır; dil lokmayı tükürükle karıştırıp yutmaya hazırlar. Tükürükteki amilaz enzimi nişastanın kimyasal sindirimini başlatır. Tükürük ayrıca besini kayganlaştırır.","Karbonhidrat sindirimi ağızda başlar; proteinlerin kimyasal sindirimi ise midede başlar."],
  esophagus:["Yemek borusu","Yutulan lokma yutaktan yemek borusuna geçer. Yemek borusunun kasları sırayla kasılıp gevşeyerek lokmayı mideye iter. Bu harekete peristaltizm denir. Yemek borusunun temel görevi taşımadır.","Besin yer çekimine karşı bile peristaltik hareketlerle mideye ilerleyebilir."],
  stomach:["Mide","Mide kasları lokmayı mide öz suyuyla karıştırarak yarı sıvı bir karışıma dönüştürür. Hidroklorik asit proteinlerin yapısını açmaya yardım eder; pepsin enzimi protein zincirlerini daha küçük parçalara keser. Mide içeriği azar azar ince bağırsağa gönderilir.","Mide asidi pepsinin çalışması için uygun ortam oluşturur. Mide, besinlerin emiliminin ana yeri değildir."],
  liver:["Karaciğer","Karaciğer safra üretir. Safra, ince bağırsakta yağları küçük damlacıklara dağıtır; böylece lipaz enziminin çalışabileceği yüzey artar. Karaciğer ayrıca bağırsaktan gelen besinleri işler, bazılarını depolar ve kanın kimyasal dengesinin korunmasına katkı verir.","Safra bir enzim değildir. Glikozun bir bölümü karaciğerde glikojen olarak depolanabilir."],
  pancreas:["Pankreas","Pankreas, ince bağırsağa amilaz, lipaz ve protein sindiriminde görevli proteazlar gibi enzimler gönderir. Ayrıca bikarbonat salgılayarak mideden gelen asidik içeriğin nötrleşmesine yardım eder. Pankreasın hormon salgılayan bölümü de kan şekerinin düzenlenmesinde rol oynar.","Pankreasın hem sindirimle ilgili dış salgı görevi hem de insülin ve glukagon salgılayan hormon görevi vardır."],
  intestine:["İnce bağırsak","İnce bağırsak üç bölümden oluşur: onikiparmak bağırsağı (duodenum), boş bağırsak (jejunum) ve kıvrım bağırsak (ileum). Kimyasal sindirimin büyük bölümü burada tamamlanır. Glikoz, amino asit, yağ sindirimi ürünleri, vitamin, mineral ve suyun büyük bölümü burada emilir.","Villuslar doku çıkıntıları, mikrovilluslar ise epitel hücrelerinin yüzeyindeki çok küçük uzantılardır."],
  colon:["Kalın bağırsak","İnce bağırsakta emilmeden kalan su ve elektrolitlerin bir bölümü kalın bağırsakta geri emilir. Bağırsak bakterileri bazı maddeleri parçalayabilir ve K vitamini gibi bazı vitaminlerin oluşumuna katkıda bulunabilir. Atık içerik dışkı hâline getirilir.","Besinlerin büyük bölümü ince bağırsakta emilir; kalın bağırsağın önemli görevlerinden biri su ve elektrolit dengesine katkı sağlamaktır."],
  gallbladder:["Safra kesesi","Karaciğerin ürettiği safrayı depolar, yoğunlaştırır ve özellikle yağ içeren besinler ince bağırsağa ulaştığında safrayı onikiparmak bağırsağına bırakır.","Safra kesesi safra üretmez; safrayı karaciğer üretir." ]
};

const stages = {
 bread:[
 ["Ağız","SİNDİRİM · AĞIZ","Nişastanın sindirimi başlar.","Dişler besini küçük parçalara ayırır; bu mekanik sindirimdir. Tükürük besini ıslatır ve amilaz enzimi ekmekteki nişastanın bağlarını keserek daha kısa karbonhidrat zincirleri oluşturur. Nişasta henüz tamamen glikoza dönüşmez.","Mekanik sindirim, besinin yüzey alanını artırır.","👄"],
 ["Yemek borusu","TAŞINMA · YEMEK BORUSU","Besin mideye ilerler.","Yutma sırasında besin lokması yutağa geçer. Yemek borusunun kasları sırayla kasılıp gevşeyerek lokmayı mideye iter; bu dalga hareketine peristaltizm denir. Besin burada yalnızca taşınır, önemli bir sindirim gerçekleşmez.","Yemek borusunun temel görevi besini taşımaktır; burada belirgin kimyasal sindirim olmaz.","〰️"],
 ["Mide","SİNDİRİM · MİDE","Besin mide içeriğiyle karışır.","Mide kasları besini mide öz suyuyla karıştırıp bulamaç hâline getirir. Midenin asidi mikroplara karşı korumaya yardım eder ve proteinlerin yapısını açar. Karbonhidrat sindirimini başlatan tükürük amilazı asidik ortamda etkisini kaybeder; bu yüzden karbonhidrat sindirimi burada belirgin biçimde yavaşlar.","Mide, karbonhidrat sindiriminin temel gerçekleştiği organ değildir.","🫙"],
 ["İnce bağırsak","SİNDİRİM · İNCE BAĞIRSAK","Nişasta glikoza kadar parçalanır.","Pankreas, ince bağırsağa amilaz enzimi gönderir; bu enzim nişasta parçalarını daha küçük şekerlere ayırır. Bağırsak yüzeyindeki maltaz gibi enzimler son basamakta glikoz oluşturur. Glikoz, bağırsak hücrelerinden kan kılcallarına geçebilir.","Karbonhidratların emilebilmesi için monosakkaritlere kadar parçalanması gerekir.","〽️"],
 ["Emilim ve taşınma","EMİLİM · KAN DOLAŞIMI","Glikoz kana geçer.","Glikoz, villusları örten epitel hücrelerinden geçerek kan kılcallarına alınır. Kan, kapı toplardamarıyla önce karaciğere gider. Karaciğer glikozun bir bölümünü glikojen olarak depolayabilir; ihtiyaç olduğunda kana glikoz verebilir.","Glikoz ve amino asitler önce kan kılcallarına geçer.","🩸"],
 ["Hücre","ENERJİ · HÜCRESEL SOLUNUM","Glikoz ATP üretiminde kullanılır.","Glikoz hücreye girdikten sonra sitoplazmada glikolizle parçalanmaya başlar. Oksijen varsa süreç mitokondride devam eder ve ATP üretimine katkı sağlar. ATP, hücrenin enerji harcayan işleri için kullanılır.","ATP, hücrenin enerji gerektiren faaliyetlerinde kullanılan temel enerji taşıyıcısıdır.","⚡"]
 ],
 egg:[
 ["Ağız","SİNDİRİM · AĞIZ","Besin parçalanır ve yutulur.","Çiğneme besini küçültür. Yumurtadaki proteinlerin kimyasal sindirimi ağızda başlamaz.","Proteinlerin kimyasal sindiriminin temel başlangıç yeri mide olarak öğretilir.","👄"],
 ["Yemek borusu","TAŞINMA · YEMEK BORUSU","Besin mideye taşınır.","Yutulan yumurta, peristaltik hareketlerle yemek borusundan mideye ilerler.","Peristaltizm besinin sindirim kanalı boyunca ilerlemesini sağlar.","〰️"],
 ["Mide","SİNDİRİM · MİDE","Proteinlerin sindirimi başlar.","Mide asidi proteinlerin katlanmış yapısını açar. Pepsin enzimi protein zincirlerini daha kısa polipeptitlere keser. Yani proteinlerin kimyasal sindirimi midede başlar.","Pepsin, protein sindiriminde görev alan bir enzimdir.","🫙"],
 ["İnce bağırsak","SİNDİRİM · İNCE BAĞIRSAK","Proteinler amino asitlere parçalanır.","Pankreasın proteaz enzimleri protein parçalarını daha kısa peptitlere ayırır. Bağırsak yüzeyindeki peptidazlar bunları amino asitlere ve çok küçük peptitlere kadar parçalar. Bu ürünler emilebilir.","Proteinlerin yapı taşları amino asitlerdir.","〽️"],
 ["Emilim ve taşınma","EMİLİM · KAN DOLAŞIMI","Amino asitler kana emilir.","Amino asitler villus epitelinden kan kılcallarına geçer. Kapı toplardamarı onları önce karaciğere taşır. Hücreler amino asitleri kendi proteinlerini üretmek ve dokuları onarmak için kullanabilir.","Amino asitler yağların aksine öncelikle kan dolaşımına katılır.","🩸"],
 ["Hücre","ENERJİ · METABOLİZMA","Amino asitler farklı amaçlarla kullanılır.","Amino asitler öncelikle protein sentezinde kullanılır. Gerektiğinde enerji metabolizmasına da katılabilir; azotlu atık oluşur.","Proteinlerin temel görevi enerji sağlamak değil, yapım ve onarıma katkıda bulunmaktır.","⚡"]
 ],
 oil:[
 ["Ağız","SİNDİRİM · AĞIZ","Yağ sindirimi sınırlı düzeydedir.","Çiğneme yağı besin içinde dağıtır. Yağların kimyasal sindiriminin büyük bölümü ince bağırsakta gerçekleşir.","Yağlar suda çözünmediği için sindirim ve emilim yolları farklı özellikler taşır.","👄"],
 ["Yemek borusu","TAŞINMA · YEMEK BORUSU","Besin mideye ilerler.","Besin, peristaltik hareketlerle mideye taşınır.","Yemek borusu besinleri ileri taşıyan kaslı bir kanaldır.","〰️"],
 ["Mide","SİNDİRİM · MİDE","Yağ sindirimi sınırlı ölçüde sürer.","Mide karıştırma hareketleri yapar; yağların kimyasal sindiriminin büyük bölümü ince bağırsakta gerçekleşir.","Yağ sindiriminde safra ve pankreas lipazı önemli rol oynar.","🫙"],
 ["İnce bağırsak","SİNDİRİM · İNCE BAĞIRSAK","Safra ve lipaz görev yapar.","Karaciğerin ürettiği safra, yağları küçük damlacıklara dağıtır; bu emülsifikasyondur, kimyasal parçalama değildir. Pankreas lipazı trigliseritleri çoğunlukla serbest yağ asitleri ve monogliseritlere ayırır. Küçük damlacıkların toplam yüzeyinin artması lipazın işini kolaylaştırır.","Safra enzim değildir; yağ damlacıklarının yüzey alanını artırır.","〽️"],
 ["Emilim ve taşınma","EMİLİM · LENF DOLAŞIMI","Yağların çoğu önce lenf yoluna katılır.","Yağ asitleri ve monogliseritler bağırsak epitel hücresine girer. Hücre içinde yeniden trigliserit oluşturulur ve proteinlerle kaplanarak şilomikron paketleri hazırlanır. Şilomikronlar villustaki lenf kılcalına geçer; lenf yoluyla daha sonra kana katılır. Bazı kısa zincirli yağ asitleri doğrudan kana geçebilir.","Uzun zincirli yağların taşınmasında lenf sistemi önemli bir ara yoldur.","🟡"],
 ["Hücre","ENERJİ · HÜCRESEL SOLUNUM","Yağ asitleri enerji üretiminde kullanılabilir.","Yağ asitleri hücrelerde beta-oksidasyonla parçalanır ve asetil-CoA gibi moleküller oluşturur. Bunlar hücresel solunum yollarına katılarak ATP üretimine katkıda bulunabilir. Yağlar uzun süreli enerji deposu olarak da önemlidir.","Yağlar gram başına karbonhidrat ve proteinlerden daha fazla enerji sağlar.","⚡"]
 ]};
let currentFood="bread", currentStage=0;
const foodNames={bread:"Ekmek",egg:"Yumurta",oil:"Zeytinyağı"};
const stageArt=[
 `<svg viewBox="0 0 180 150" role="img" aria-label="Ağız ve çiğneme"><path d="M35 55Q90 20 145 55Q135 105 90 112Q45 105 35 55Z" fill="#b85f68" stroke="#f1b4a2" stroke-width="5"/><path d="M49 61Q90 82 131 61L124 82Q90 99 56 82Z" fill="#f5e7d5"/><path d="M62 61v18m14-15v19m14-17v19m14-19v17m14-20v15" stroke="#c7a995" stroke-width="3"/><path d="M40 45Q90 5 140 45" fill="none" stroke="#65d9c1" stroke-width="5" stroke-linecap="round"/><circle cx="90" cy="25" r="5" fill="#eab77d"/></svg>`,
 `<svg viewBox="0 0 180 150" role="img" aria-label="Yemek borusu ve peristaltizm"><path d="M72 18C80 35 63 46 72 62S80 88 72 105S80 126 88 137" fill="none" stroke="#eaa17e" stroke-width="22" stroke-linecap="round"/><path d="M72 18C80 35 63 46 72 62S80 88 72 105S80 126 88 137" fill="none" stroke="#f6c5a8" stroke-width="9" stroke-linecap="round"/><path d="M48 48q24 16 48 0M48 87q24 16 48 0" fill="none" stroke="#65d9c1" stroke-width="5" stroke-linecap="round"/><path d="M88 126l0 15m-7-8 7 8 7-8" stroke="#eab77d" stroke-width="4" fill="none"/></svg>`,
 `<svg viewBox="0 0 180 150" role="img" aria-label="Mide"><path d="M82 18v34c0 13-19 14-26 30-13 30 7 55 39 54 36-1 55-26 47-56-5-19-21-22-28-37-5-10-4-18-4-25" fill="#bd6872" stroke="#f2b3a3" stroke-width="6" stroke-linejoin="round"/><path d="M84 22v28m25-28v22" stroke="#f2d4bd" stroke-width="5" stroke-linecap="round"/><path d="M64 81q24 17 55 0m-48 24q22 13 43 0" fill="none" stroke="#f3c37d" stroke-width="4" stroke-linecap="round"/></svg>`,
 `<svg viewBox="0 0 180 150" role="img" aria-label="İnce bağırsak"><path d="M45 35q-18 22 5 35t-2 31q-20 20 4 34h82q22-15 2-34t0-31q20-22 0-35" fill="none" stroke="#eaa17e" stroke-width="17" stroke-linecap="round"/><path d="M45 35q-18 22 5 35t-2 31q-20 20 4 34h82q22-15 2-34t0-31q20-22 0-35" fill="none" stroke="#f6c6a9" stroke-width="7" stroke-linecap="round"/><path d="M62 45q24-17 47 0t0 27q-25 14-1 29t0 22" fill="none" stroke="#65d9c1" stroke-width="4" stroke-linecap="round"/></svg>`,
 `<svg viewBox="0 0 180 150" role="img" aria-label="Emilim ve kan kılcalı"><path d="M30 75h120" stroke="#e76f78" stroke-width="10" stroke-linecap="round"/><path d="M70 75V34m0 41V116m0-41-22-22m22 22 24-22m-24 22-22 22m22-22 24 22" stroke="#f29aa0" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="70" cy="75" r="10" fill="#f6d08c"/><circle cx="30" cy="75" r="6" fill="#f6d08c"/><circle cx="150" cy="75" r="6" fill="#f6d08c"/></svg>`,
 `<svg viewBox="0 0 180 150" role="img" aria-label="Hücre ve mitokondri"><circle cx="90" cy="75" r="57" fill="#2a7c78" stroke="#83e0c8" stroke-width="5"/><circle cx="77" cy="67" r="20" fill="#1c4555" stroke="#9cc9d1" stroke-width="3"/><path d="M106 53q30-10 29 13t-29 16q-16-9 0-29Z" fill="#eab77d" stroke="#f5d6a0" stroke-width="3"/><path d="M108 62q12-9 20 2m-20 8q12-9 20 2" fill="none" stroke="#8b5d39" stroke-width="3" stroke-linecap="round"/><path d="M35 25l10-10m-3 0h3v3" stroke="#65d9c1" stroke-width="3" fill="none"/></svg>`
];
const $=id=>document.getElementById(id);
function renderStage(){const s=stages[currentFood][currentStage];$("food-title").textContent=foodNames[currentFood]+" yolculuğu";$("stage-count").textContent=String(currentStage+1).padStart(2,"0")+" / 06";$("progress-bar").style.width=((currentStage+1)/6*100)+"%";$("stage-tag").textContent=s[1];$("stage-title").textContent=s[2];$("stage-desc").textContent=s[3];$("stage-note").textContent=s[4];$("stage-visual").querySelector(".stage-icon").innerHTML=stageArt[currentStage];$("prev-stage").disabled=currentStage===0;$("next-stage").innerHTML=currentStage===5?'Yeniden başlat <span>↻</span>':'Sonraki durak <span>→</span>';$("stage-dots").innerHTML=stages[currentFood].map((_,i)=>`<button class="stage-dot ${i===currentStage?'active':''}" aria-label="Durak ${i+1}" data-stage="${i}"></button>`).join("");document.querySelectorAll(".stage-dot").forEach(b=>b.onclick=()=>{currentStage=+b.dataset.stage;renderStage()})}
document.querySelectorAll(".food-card").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".food-card").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFood=b.dataset.food;currentStage=0;renderStage()}));
$("prev-stage").onclick=()=>{if(currentStage>0){currentStage--;renderStage()}};
$("next-stage").onclick=()=>{currentStage=currentStage===5?0:currentStage+1;renderStage()};
renderStage();

const questions=[
 ["Sindirim ne demektir?",["Besinlerin kana pompalanması","Büyük besin moleküllerinin küçük yapı taşlarına ayrılması","Hücrelerin ATP harcaması","Suyun böbrekten atılması"],1,"Sindirim, büyük molekülleri emilebilecek küçük birimlere ayırır."],
 ["Aşağıdakilerden hangisi mekanik sindirime örnektir?",["Amilazın nişastayı parçalaması","Pepsinin proteinleri kesmesi","Dişlerin besini çiğnemesi","Lipazın yağı parçalaması"],2,"Çiğneme besinin fiziksel olarak küçültülmesidir; molekülün kimyasal yapısını enzimle değiştirmez."],
 ["Karbonhidrat sindirimi hangi yapıda başlar?",["Ağız","Mide","Kalın bağırsak","Yemek borusu"],0,"Tükürük amilazı ağızda nişastanın sindirimini başlatır."],
 ["Proteinlerin kimyasal sindirimi nerede başlar?",["Ağız","Mide","Kalın bağırsak","Yemek borusu"],1,"Mide asidi proteinlerin yapısını açar; pepsin protein zincirlerini kesmeye başlar."],
 ["Safranın yağ sindirimindeki temel görevi nedir?",["Yağı doğrudan amino aside çevirmek","Yağları küçük damlacıklara dağıtmak","Glikoz üretmek","Proteinleri parçalamak"],1,"Safra enzim değildir. Yağı küçük damlacıklara ayırarak lipazın etki edeceği yüzeyi artırır."],
 ["Nişastanın sindirimi sonunda emilebilen temel ürün hangisidir?",["Glikoz","Gliserol","Amino asit","Nükleotit"],0,"Nişasta bir karbonhidrattır; sindirim sonunda glikoz gibi monosakkaritler oluşur."],
 ["Proteinlerin yapı taşları hangileridir?",["Yağ asitleri","Glikozlar","Amino asitler","Mineraller"],2,"Proteinler amino asitlerden oluşur. Sindirim, proteinleri bu yapı taşlarına ayırır."],
 ["Besinlerin emiliminin büyük bölümü nerede gerçekleşir?",["Mide","İnce bağırsak","Yemek borusu","Ağız"],1,"İnce bağırsak, geniş yüzey alanı ve taşıyıcı mekanizmaları sayesinde emilimin ana merkezidir."],
 ["Villus nedir?",["Hücre çekirdeği","Bağırsak duvarındaki parmak benzeri çıkıntı","Bir sindirim enzimi","Bir kan hücresi"],1,"Villus bağırsak iç yüzeyinden uzanan doku çıkıntısıdır; içinde kan ve lenf kılcalları bulunur."],
 ["Mikrovillus villusa göre nerededir?",["Mikrovillus villusun içindeki kan damarıdır","Mikrovillus bağırsak dışındaki kastır","Mikrovillus epitel hücresinin yüzeyindeki çok küçük uzantıdır","İkisi tamamen aynı yapıdır"],2,"Villus doku düzeyinde, mikrovillus ise onu örten epitel hücresinin yüzeyindedir."],
 ["Villus ve mikrovillusların en önemli ortak katkısı nedir?",["Bağırsak yüzey alanını artırmak","Besini mideye geri göndermek","Safra üretmek","Oksijen üretmek"],0,"Yüzey alanının artması, besinlerin bağırsak duvarından emilmesi için daha geniş alan sağlar."],
 ["Glikoz emildikten sonra öncelikle hangi yola katılır?",["Lenf kılcalı","Kan kılcalı","Yemek borusu","Safra kanalı"],1,"Glikoz villus kan kılcallarına geçer ve kapı toplardamarıyla önce karaciğere taşınır."],
 ["Uzun zincirli yağların çoğu bağırsak hücresinde hangi paketlere dönüştürülür?",["Şilomikron","Glikojen","Hemoglobin","Amilaz"],0,"Yağ ürünleri yeniden trigliseritlere dönüştürülür ve şilomikron adı verilen parçacıklara paketlenir."],
 ["Şilomikronlar villusta öncelikle hangi damara geçer?",["Kan kılcalı","Lenf kılcalı","Atardamar","Safra kanalı"],1,"Şilomikronlar çoğunlukla lenf kılcalına girer, sonra lenf yoluyla kana katılır."],
 ["Suda çözünen B ve C vitaminleri çoğunlukla hangi yolla taşınır?",["Kan","Lenf şilomikronları","Yemek borusu","Safra"],0,"B ve C vitaminleri genellikle kan dolaşımına katılır. B12'nin emilimi için intrinsik faktör gerekir."],
 ["Suyun emilimi hakkında hangisi doğrudur?",["Suyun tamamı yalnız kalın bağırsakta emilir","Suyun büyük bölümü ince bağırsakta, kalanı kalın bağırsakta emilir","Su sindirilerek glikoza dönüşür","Su yalnız midede emilir"],1,"Suyun çoğu ince bağırsakta geri alınır; kalın bağırsak kalan su ve elektrolitlerin emilimine katkı sağlar."],
 ["Kapı toplardamarı emilen glikoz ve amino asitleri önce nereye götürür?",["Akciğere","Karaciğere","Böbrek dışına","Kalbe doğrudan"],1,"Bağırsaktan gelen besince zengin kan, kapı toplardamarıyla önce karaciğere ulaşır."],
 ["Sindirim, emilim ve taşınma arasındaki doğru sıralama hangisidir?",["Taşınma → sindirim → emilim","Emilim → taşınma → sindirim","Sindirim → emilim → taşınma","Emilim → sindirim → taşınma"],2,"Önce besinler parçalanır, sonra ürünler bağırsak duvarından alınır, ardından vücutta taşınır."],
 ["Glikozun oksijenli hücresel solunumunda ATP üretiminin önemli bir bölümü hangi organelde gerçekleşir?",["Ribozom","Mitokondri","Lizozom","Golgi aygıtı"],1,"Glikoliz sitoplazmada başlar; oksijenli solunumun sonraki basamakları mitokondride gerçekleşir."],
 ["Aşağıdakilerden hangisi sindirim ve emilimin sağlık için önemli olmasının nedenidir?",["Hücrelere yapı taşı ve enerji kaynağı sağlamaya yardım etmeleri","Kanı tamamen sindirmeleri","Bütün vitaminleri vücutta üretmeleri","Oksijenin yerini almaları"],0,"Hücreler enerji üretmek, büyümek ve onarım yapmak için besinlerden gelen moleküllere ihtiyaç duyar."],
 ["Doğru mu yanlış mı? Safra, yağları kimyasal olarak parçalayan bir enzimdir.",["Doğru","Yanlış","Yalnız midede doğru","Yalnız ağızda doğru"],1,"Safra enzim değildir; yağları küçük damlacıklara dağıtır. Kimyasal parçalamayı lipaz enzimi yapar."],
 ["Doğru mu yanlış mı? Sindirim doğrudan ATP üretir.",["Doğru","Yanlış","Sadece ince bağırsakta doğru","Sadece midede doğru"],1,"Sindirim besinleri parçalar. ATP, hücrelerde hücresel solunum gibi metabolik yollarla üretilir."],
 ["Proteinler vücutta öncelikle hangi amaçla kullanılır?",["Doku yapımı ve onarımı","Tek başına oksijen taşımak","Safra üretmek","Suyu parçalamak"],0,"Proteinlerin temel görevleri yapım, onarım, enzim ve bazı düzenleyici moleküllerin oluşturulmasıdır. Gerektiğinde enerji için de kullanılabilir."],
 ["Kalın bağırsağın önemli görevlerinden biri hangisidir?",["Protein sindirimini başlatmak","Kalan su ve elektrolitleri emmek","Safra üretmek","Nişastayı ilk kez parçalamak"],1,"Kalın bağırsak, sindirim kanalında kalan su ve elektrolitlerin geri emilmesine katkıda bulunur."],
 ["Besinlerin emilebilmesi için çoğunlukla neden küçük moleküllere ayrılması gerekir?",["Büyük moleküller bağırsak epitelinden kolayca geçemediği için","Küçük moleküller daha ağır olduğu için","Büyük moleküller oksijen üretmediği için","Sindirim yalnız tat almak için olduğu için"],0,"Bağırsak epitelinin seçici bariyerinden geçiş için karbonhidrat, protein ve yağların sindirim ürünlerine ayrılması gerekir."]
];
let qi=0,score=0,chosen=null,answered=false;
function renderQuiz(){const q=questions[qi];$("quiz-number").textContent=`SORU ${qi+1} / ${questions.length}`;$("quiz-progress").style.width=((qi+1)/questions.length*100)+"%";$("question").textContent=q[0];$("answers").innerHTML=q[1].map((a,i)=>`<button class="answer" data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${a}</button>`).join("");$("quiz-feedback").textContent="Bir cevap seçerek devam et.";$("quiz-next").disabled=true;$("quiz-next").innerHTML=qi===questions.length-1?'Sonucu gör <span>→</span>':'Devam et <span>→</span>';chosen=null;answered=false;document.querySelectorAll(".answer").forEach(b=>b.onclick=()=>{if(answered)return;chosen=+b.dataset.answer;answered=true;const correct=questions[qi][2];document.querySelectorAll(".answer").forEach((x,i)=>{if(i===correct)x.classList.add("correct");else if(i===chosen)x.classList.add("wrong")});if(chosen===correct){score++;$("quiz-feedback").textContent="Doğru! "+q[3]}else{$("quiz-feedback").textContent="Bu kez olmadı. "+q[3]}$("quiz-next").disabled=false})}
const quizBox=document.querySelector(".quiz-box");const quizTemplate=quizBox.innerHTML;
$("quiz-next").onclick=()=>{if(qi<questions.length-1){qi++;renderQuiz()}else{const pct=Math.round(score/questions.length*100);quizBox.innerHTML=`<div class="panel-kicker">TEST TAMAMLANDI</div><div class="result-score">%${pct}</div><h3>${score} / ${questions.length} doğru cevap</h3><p style="color:var(--muted);font-size:13px;line-height:1.8">${pct===100?"Harika! Sekiz öğrenme hedefinin tamamını kavramışsın.":pct>=70?"İyi ilerleme! Yanlış yanıtların açıklamalarını tekrar inceleyip bilgilerini güçlendirebilirsin.":"Temel bölümlere geri dönüp tekrar dene. Her sorunun açıklaması doğru bilgiyi öğrenmene yardımcı olur."}</p><button class="primary-btn" id="retry-quiz">Tekrar çöz <span>↻</span></button>`;document.getElementById("retry-quiz").onclick=()=>{qi=0;score=0;quizBox.innerHTML=quizTemplate;renderQuiz();quizBox.scrollIntoView({behavior:"smooth",block:"center"})}}};
renderQuiz();

// Organ information panel — tek tanım kullanılır.
let organMeshes=[];
let anatomyState={isolate:true,labels:true};
let selectedOrgan="stomach";

function showOrgan(key){
 const d=organData[key];
 if(d){$("organ-title").textContent=d[0];$("organ-desc").textContent=d[1];$("organ-fact").innerHTML=`<span>✦</span> ${d[2]}`;}
 document.querySelectorAll(".organ-chip").forEach(x=>x.classList.toggle("active",x.dataset.organ===key));
 selectedOrgan=key;highlightOrgan(key);
}
const organOrder=["mouth","esophagus","stomach","liver","gallbladder","pancreas","intestine","colon"];
$("organ-list").innerHTML=organOrder.map(k=>`<button class="organ-chip" data-organ="${k}">${organData[k][0]}</button>`).join("");
document.querySelectorAll(".organ-chip").forEach(b=>b.onclick=()=>showOrgan(b.dataset.organ));

function organNameMatches(key,name){
 const patterns={mouth:/mouth|tongue|pharynx|salivary/,esophagus:/esoph|oesoph/,stomach:/stomach/,liver:/liver/,pancreas:/pancre/,intestine:/small.?intestin|intestin.?small|duoden|jejun|ileum/,colon:/large.?intestin|intestin.?large|colon|rectum|appendix/,gallbladder:/gall.?bladder|vesica.?biliaris/};
 return patterns[key]?.test(name)||false;
}
function meshMatchesOrgan(mesh,key){
 let n=(mesh.name||"").toLowerCase();
 if(organNameMatches(key,n))return true;
 let parent=mesh.parent;while(parent){if(organNameMatches(key,(parent.name||"").toLowerCase()))return true;parent=parent.parent;}
 return false;
}
function highlightOrgan(key){
 organMeshes.forEach(m=>{
   const active=meshMatchesOrgan(m,key);
   const mats=Array.isArray(m.material)?m.material:[m.material];
   mats.forEach(mat=>{if(!mat)return;mat.transparent=anatomyState.isolate&&!active;mat.opacity=anatomyState.isolate&&!active?.16:1;mat.depthWrite=!(anatomyState.isolate&&!active);if(mat.emissive){mat.emissive.setHex(active?0x167f70:0x000000);mat.emissiveIntensity=active?.35:0;}mat.needsUpdate=true;});
 });
}
function makeAnatomyLabels(container){
 const old=container.querySelector(".anatomy-labels");if(old)old.remove();
 const layer=document.createElement("div");layer.className="anatomy-labels";
 const labels=[["Ağız","mouth",8,10],["Yemek borusu","esophagus",66,22],["Karaciğer","liver",7,40],["Mide","stomach",68,43],["Safra kesesi","gallbladder",7,52],["Pankreas","pancreas",7,63],["İnce bağırsak","intestine",66,66],["Kalın bağırsak","colon",7,79]];
 labels.forEach(([name,key,left,top])=>{const el=document.createElement("button");el.className="anatomy-label";el.textContent=name;el.style.left=left+"%";el.style.top=top+"%";el.onclick=()=>showOrgan(key);layer.appendChild(el);});container.appendChild(layer);
}
function setupScene(containerId,interactive=true){
 const container=document.getElementById(containerId);if(!container)return null;
 const scene=new THREE.Scene();scene.background=null;
 const camera=new THREE.PerspectiveCamera(35,container.clientWidth/container.clientHeight,.01,1000);
 camera.position.set(0,1.1,4.2);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(container.clientWidth,container.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;container.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xd8fff5,0x23323d,2.1));const keyLight=new THREE.DirectionalLight(0xffffff,2.7);keyLight.position.set(3,5,5);scene.add(keyLight);const fill=new THREE.DirectionalLight(0x65d9c1,1.5);fill.position.set(-4,1,2);scene.add(fill);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;controls.minDistance=1.5;controls.maxDistance=8;controls.target.set(0,.9,0);controls.autoRotate=!interactive;controls.autoRotateSpeed=.35;
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
 const modelUrl="https://cdn.jsdelivr.net/npm/open-anatomy-3d@0.1.0/models/anatomy-male.glb";
 loader.load(modelUrl,gltf=>{
   const model=gltf.scene;scene.add(model);
   ["skin","muscles","nerves","vessels"].forEach(name=>{const layer=model.getObjectByName(name);if(layer)layer.visible=false;});
   const organsLayer=model.getObjectByName("organs");if(organsLayer)organsLayer.visible=true;
   model.traverse(obj=>{
     if(!obj.isMesh)return;
     const n=(obj.name||"").toLowerCase();
     const digestive=/esoph|oesoph|stomach|liver|pancre|intestin|colon|rectum|gall|duoden|appendix|tongue|mouth|pharynx|salivary|jejun|ileum/.test(n);
     if(obj.parent&&obj.parent.name==="organs"&&!digestive)obj.visible=false;
     if(digestive){obj.userData.organKey=n;organMeshes.push(obj);}
     const wasArray=Array.isArray(obj.material);
     const materials=wasArray?obj.material:[obj.material];
     const cloned=materials.map(m=>{const clone=m.clone();clone.roughness=Math.min(clone.roughness??.6,.72);return clone;});
     obj.material=wasArray?cloned:cloned[0];
   });
   const box=new THREE.Box3().setFromObject(model);const center=box.getCenter(new THREE.Vector3());const size=box.getSize(new THREE.Vector3());model.position.sub(center);
   const centeredBox=new THREE.Box3().setFromObject(model);const centeredSize=centeredBox.getSize(new THREE.Vector3());const maxDim=Math.max(centeredSize.x,centeredSize.y,centeredSize.z);
   controls.target.set(0,0,0);camera.position.set(0,maxDim*.08,maxDim*(interactive?2.05:2.35));camera.near=Math.max(.001,maxDim/1000);camera.far=maxDim*20;camera.updateProjectionMatrix();controls.minDistance=maxDim*.55;controls.maxDistance=maxDim*5;controls.update();
   if(interactive){makeAnatomyLabels(container);$("organ-title").textContent="Sindirim sistemini keşfet";$("organ-desc").textContent="Gerçek anatomik model yüklendi. Organlardan birine tıkla veya sağdaki listeden seç.";$("organ-fact").innerHTML="<span>✦</span> Seçili organı öne çıkarabilir, diğer organları saydamlaştırarak konumunu inceleyebilirsin.";showOrgan("stomach");}
   else { // Ana sayfanın sağında da aynı gerçek model kullanılır.
     const digestMeshes=[];model.traverse(o=>{if(o.isMesh&&/esoph|stomach|liver|pancre|intestin|colon|rectum|duoden|mouth|tongue/.test((o.name||"").toLowerCase()))digestMeshes.push(o);});
   }
 },undefined,error=>{console.error("Anatomi modeli yüklenemedi:",error);if(interactive){$("organ-title").textContent="3D model yüklenemedi";$("organ-desc").textContent="İnternet bağlantını kontrol edip sayfayı yenile. Model CDN üzerinden yüklenir.";}else{container.innerHTML='<div class="loading-model">Anatomik model yüklenemedi. İnternet bağlantısını kontrol et.</div>';}});
 if(interactive){
   renderer.domElement.addEventListener("click",e=>{const r=renderer.domElement.getBoundingClientRect();mouse.x=((e.clientX-r.left)/r.width)*2-1;mouse.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(organMeshes,true);if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.organKey)obj=obj.parent;if(obj?.userData.organKey){const mapped=organOrder.find(k=>meshMatchesOrgan(obj,k));if(mapped)showOrgan(mapped);else{$("organ-title").textContent=obj.name.replaceAll("_"," ");$("organ-desc").textContent="Bu yapı sindirim sistemi çevresindeki anatomik modelde gösterilmektedir.";}}}});
   $("isolate-organ").onchange=e=>{anatomyState.isolate=e.target.checked;highlightOrgan(selectedOrgan);};
   $("show-labels").onchange=e=>{anatomyState.labels=e.target.checked;const labels=container.querySelector(".anatomy-labels");if(labels)labels.style.display=e.target.checked?"block":"none";};
 }
 const resize=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);});resize.observe(container);
 const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}animate();return {controls,camera};
}
setupScene("hero-art",false);

setupScene("anatomy-canvas",true);
