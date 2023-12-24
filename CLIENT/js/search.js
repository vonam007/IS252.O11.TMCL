// Chèn jQuery từ CDN
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.4.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Chờ jQuery được tải xong trước khi thực thi mã
script.onload = function () {
    $(document).ready(function () {
        const searchInput = $("#searchInput");
        const suggestionsList = $("#suggestions");

        // Đường dẫn đến file CSV
        const csvFilePath = "../src/final_dataset.csv";

        // Đọc dữ liệu từ file CSV
        $.ajax({
            type: "GET",
            url: csvFilePath,
            dataType: "text",
            success: function (data) {
                // Chuyển đổi dữ liệu CSV thành mảng
                const dataArray = CSVToArray(data);

                // Mảng chứa dữ liệu từ cột 'title'
                const titlesArray = dataArray.map(row => (row[16] ? row[16].slice(1, -1) : ""));
                const cpuArray = dataArray.map(row => row[4]);
                const memoryArray = dataArray.map(row => row[5]);
                const storageArray = dataArray.map(row => row[6]);
                const screenSizeArray = dataArray.map(row => row[3]);
                const resolutionArray = dataArray.map(row => row[8]);
                const gpuArray = dataArray.map(row => row[7]);
                const osArray = dataArray.map(row => row[12]);
                const priceArray = dataArray.map(row => row[1]);
                const linkArray = dataArray.map(row => row[17]);

                // Xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
                searchInput.on("input", function () {
                    const userInput = searchInput.val().toLowerCase();
                    const filteredTitles = titlesArray
                        .filter(title => title && title.toLowerCase().includes(userInput))
                        .slice(0, 10); // Lấy 10 kết quả đầu tiên

                    // Hiển thị gợi ý
                    displaySuggestions(filteredTitles);
                });

                // Xử lý sự kiện khi người dùng bấm nút search
                $("#searchBtn").on("click", function () {
                    // Lấy giá trị được nhập trong ô tìm kiếm
                    const userInput = $("#searchInput").val().toLowerCase();

                    // Tìm vị trí của item trong mảng titlesArray
                    const selectedItemIndex = titlesArray.findIndex(title => title.toLowerCase().includes(userInput));

                    // Kiểm tra xem item có được tìm thấy hay không
                    if (selectedItemIndex !== -1) {

                        // Trích xuất thông tin từ các cột khác của item
                        let selectedTitle = titlesArray[selectedItemIndex];
                        let selectedPrice = priceArray[selectedItemIndex];
                        let selectedLink = linkArray[selectedItemIndex];
                        let selectedCpu = cpuArray[selectedItemIndex];
                        let selectedMemory = memoryArray[selectedItemIndex];
                        let selectedStorage = storageArray[selectedItemIndex];
                        let selectedScreenSize = screenSizeArray[selectedItemIndex];
                        let selectedResolution = resolutionArray[selectedItemIndex];
                        let selectedGpu = gpuArray[selectedItemIndex];
                        let selectedOs = osArray[selectedItemIndex];

                        addItem(selectedTitle, selectedPrice, selectedLink, selectedCpu, selectedMemory, selectedStorage, selectedScreenSize, selectedResolution, selectedGpu, selectedOs);
                    } else {
                        // Xử lý khi không tìm thấy item
                        console.log("Item not found");
                    }
                });
            }
        });

        // Hàm thêm item vào trang web
        function addItem(title, price, link, cpu, memory, storage, screenSize, resolution, gpu, os) {
            // lấy ảnh từ nguồn
            //sendDataToAPI(link);
            sublink = link.substr(-8);
            var imglink = "https://c1.neweggimages.com/ProductImageCompressAll1280/" + sublink.slice(0, 2) + "-" + sublink.slice(2, 5) + "-" + sublink.slice(5) + "-01.jpg";

            // In ra kết quả
            console.log(imglink);
            let contentContain = document.getElementById("product-contain");
            // Tạo element mới
            let content = `
                <div class="product-contain" id="product-contain">
                    <div class="product-img">
                        <img src="${imglink}" alt="An Image about a laptop" id="laptopImg">
                    </div>
                    <div class="product-info">
                        <h3>${title}</h3>
                        <p class="prices">$${price}</p>
                        <p>Memory: ${memory}GB - Storage: ${storage}GB</p>
                        <p>Screen Size: ${screenSize}inch - Resolution: ${resolution}</p>
                        <p>CPU: ${cpu}</p>
                        <p>GPU: ${gpu}</p>
                        <p>OS: ${os}</p>
                        <a href="${link}" target="_blank">Buy Now</a>
                    </div>
            `
            
            // Thêm element vào trang web
            contentContain.innerHTML = content;
            let myImage = document.getElementById('laptopImg');

            myImage.onload = function() {
              console.log('Image loaded successfully');
            };
        
            myImage.onerror = function() {
              console.log('Error loading image');
              // Thực hiện các thao tác khi có lỗi load hình ảnh
              // Thay đổi src thành một hình ảnh khác
              myImage.src = "https://c1.neweggimages.com/ProductImageCompressAll1280/" + sublink.slice(0, 2) + "-" + sublink.slice(2, 5) + "-" + sublink.slice(5) + "-18.jpg";
            };
            
        }

        

        // Hiển thị gợi ý
        function displaySuggestions(suggestions) {
            suggestionsList.empty();

            if (suggestions.length > 0) {
                suggestions.forEach(suggestion => {
                    const li = $("<li>").text(suggestion);

                    // Xử lý sự kiện khi người dùng chọn gợi ý
                    li.on("click", function () {
                        searchInput.val(suggestion);
                        suggestionsList.hide();
                    });

                    suggestionsList.append(li);
                });

                suggestionsList.show();
            } else {
                suggestionsList.hide();
            }
        }

        // Ẩn gợi ý khi nhấp ra ngoài ô tìm kiếm
        $(document).on("click", function (event) {
            if (!$(event.target).is("#searchInput")) {
                suggestionsList.hide();
            }
        });

        // Hàm chuyển đổi dữ liệu CSV thành mảng
        function CSVToArray(csvString, delimiter = ",") {
            const rows = csvString.split("\n");
            return rows.map(row => row.split(delimiter));
        }



    });
}