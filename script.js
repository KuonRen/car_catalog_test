document.addEventListener("DOMContentLoaded", function () {
    let carsData = {};
    let sortType = "name"; // 初期値: A-Z
    let sortOrder = "asc"; // 初期値: 昇順

    // JSONデータの読み込み
    async function loadCarsData() {
        try {
            const response = await fetch("cars.json");
            carsData = await response.json();
            populateCars();
        } catch (error) {
            console.error("Error loading the car data:", error);
        }
    }

    // 車両データをHTMLに反映
    function populateCars() {
        Object.keys(carsData).forEach(category => {
            const categoryContainer = document.getElementById(category);
            categoryContainer.innerHTML = "";

            let sortedCars = [...carsData[category]];

            // 並び替え
            sortedCars.sort((a, b) => {
                if (sortType === "name") {
                    return sortOrder === "asc" 
                        ? a.name.localeCompare(b.name, "ja") 
                        : b.name.localeCompare(a.name, "ja");
                } else { // price
                    return sortOrder === "asc" 
                        ? a.price - b.price 
                        : b.price - a.price;
                }
            });

            sortedCars.forEach(car => {
                const carItem = document.createElement("div");
                carItem.classList.add("car-item");

                const carImage = document.createElement("img");
                carImage.src = car.image;
                carImage.alt = `${car.name} Image`;
                carItem.appendChild(carImage);

                const carName = document.createElement("div");
                carName.classList.add("car-name");
                carName.textContent = car.name;
                carItem.appendChild(carName);

                const carPrice = document.createElement("div");
                carPrice.classList.add("car-price");
                carPrice.textContent = `価格: ${car.price.toLocaleString()} 円`;
                carItem.appendChild(carPrice);

                categoryContainer.appendChild(carItem);
            });
        });
    }

    // 並び替え切り替えボタン
    document.getElementById("sortButton").addEventListener("click", function () {
        sortType = sortType === "name" ? "price" : "name";
        updateSortButtonLabel();
        populateCars();
    });

    // 昇順・降順切り替えボタン
    document.getElementById("orderButton").addEventListener("click", function () {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        updateOrderButtonLabel();
        populateCars();
    });

    // ボタンのラベル更新
    function updateSortButtonLabel() {
        document.getElementById("sortButton").textContent = sortType === "name" ? "A-Z" : "価格";
    }

    function updateOrderButtonLabel() {
        document.getElementById("orderButton").textContent = sortOrder === "asc" ? "昇順" : "降順";
    }

    // 検索機能
    document.getElementById("searchButton").addEventListener("click", function () {
        let searchQuery = document.getElementById("searchInput").value.toLowerCase();
        let allCategories = ["sports", "super", "bike"];
        let found = false;

        for (let category of allCategories) {
            let allCars = document.querySelectorAll(`#${category} .car-item`);
            for (let car of allCars) {
                let carName = car.querySelector(".car-name").textContent.toLowerCase();
                if (carName.includes(searchQuery)) {
                    showCategory(category);
                    car.scrollIntoView({ behavior: "smooth", block: "center" });
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (!found) {
            alert("該当する車両が見つかりません");
        }
    });

    // カテゴリ切り替え
    function showCategory(category) {
        document.querySelectorAll(".catalog").forEach(catalog => {
            catalog.style.display = "none";
        });

        document.getElementById(category).style.display = "flex";
    }

    // 初期化
    loadCarsData();
    updateSortButtonLabel();
    updateOrderButtonLabel();
});
