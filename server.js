const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const path = require('path'); 
const app = express();
const PORT = process.env.PORT || 3000; // Render-де автомат порт таңдау

// 🔹 Барлық оқушыларға ортақ сілтемелер
const COMMON_TUTOR_LINK = "https://youtube.com/shorts/M-TFt-O7-2A";
const COMMON_SITE_LINK = "https://kasip.org/kz";

// 🔹 CORS (басқа домендерден API-ға кіруге рұқсат беру)
app.use(cors());

// 🔹 HTML, CSS және JS файлдарын көрсету
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Excel-ден дерек алу
function loadData() {
    const workbook = XLSX.readFile('data.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    const db = {};

    data.forEach(entry => {
        // 🔹 Егер number немесе promo жоқ болса, өткізіп жібереміз
        if (!entry.number || !entry.promo) {
            console.log("⚠️ Ескерту: Excel-де бос немесе дұрыс емес жол бар! Оны тексеріңіз:", entry);
            return;
        }

        // 🔹 Санды немесе мәтінді дұрыс оқу үшін number-ды өңдейміз
        const number = entry.number.toString().trim();
        db[number] = { promo: entry.promo };
    });

    return db;
}


// 🔹 Промокод сұрау
app.get('/promo/:number', (req, res) => {
    const number = req.params.number;
    const database = loadData();

    if (database[number]) {
        res.json({
            promo: database[number].promo,
            tutorLink: COMMON_TUTOR_LINK,  
            siteLink: COMMON_SITE_LINK    
        });
    } else {
        res.json({ error: 'Бұл номер табылмады' });
    }
});

// 🔹 Басты бет (index.html) көрсету
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 Серверді іске қосу
app.listen(PORT, () => {
    console.log(`Сервер http://localhost:${PORT} адресінде жұмыс істеп тұр`);
});


