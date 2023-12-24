const submitBtn = document.getElementById('predict-Btn');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let Memory = document.getElementById('Memory').value;
    let Storage = document.getElementById('Storage').value;
    let ppi = document.getElementById('ppi').value;
    let ScreenSize = document.getElementById('screen').value;
    let cpu = document.getElementById('CPU').value;
    let gpu = document.getElementById('GPU').value;
    let brand = document.getElementById('Brand').value;
    let os = document.getElementById('OS').value;
    let graphic = document.getElementById('Graphic').value;

    let backlit = document.getElementsByName('backlit');
    let backlitValue;
    for (var i = 0; i < backlit.length; i++) {
        if (backlit[i].checked) {
            // Nếu radio button đang được chọn, lấy giá trị của nó
            backlitValue = backlit[i].value;
            break;
        }
    }

    let thunderbolt = document.getElementsByName('tbgate');
    let thunderboltValue;
    for (var i = 0; i < thunderbolt.length; i++) {
        if (thunderbolt[i].checked) {
            // Nếu radio button đang được chọn, lấy giá trị của nó
            thunderboltValue = thunderbolt[i].value;
            break;
        }
    }

    let data = {
        "Memory": Memory,
        "Storage": Storage,
        "ppi": ppi,
        "Screen Size": ScreenSize,
        "Backlit Keyboard": backlitValue,
        "Thunderbolt": thunderboltValue,
        "Graphic Type": graphic,
        "CPU_series": cpu,
        "GPU_brand": gpu,
        "Brand": brand,
        "Operating System": os
    }
    
    sendDataToAPI(data)
});

function sendDataToAPI(Data) {
    const BASE = "http://127.0.0.1:5000"; // Replace with your Flask API URL

    const apiUrl = BASE + "/predict"; // Replace with your Flask API endpoint



    function isJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Sử dụng hàm isJSON để kiểm tra

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (isJSON(response)) {
                console.log("Response is a valid JSON.");
                const jsonResponse = JSON.parse(response);
                console.log(jsonResponse);
                // Do something with jsonResponse here
                pricePredict(jsonResponse);
            } else {
                console.log("Response is not a valid JSON.");
                console.log(response);
            }

        }
    };

    let jsonData = JSON.stringify(Data);
    xhr.send(jsonData);
}

function pricePredict(jsonResponse) {
    let price = document.getElementById('price-value-change');
    price.innerHTML = jsonResponse[0]['pred_price'];
    let similarLaptop = document.getElementById('similar-items');

    for (let i = 1; i <= 4; i++) {
        similarLaptop.innerHTML += `
        <div class="newElement">
        <a href="${jsonResponse[i]['link']}" target="_blank">${jsonResponse[i]['FirstLetters']}</a>
        <p>Price: $${jsonResponse[i]['Price']}</p>
        </div>
        `
    }
}