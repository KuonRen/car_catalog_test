// JSONデータの読み込み関数
async function loadCarsData() {
    try {
        const response = await fetch('cars.json'); // cars.jsonを読み込む
        const data = await response.json();
        populateCars(data);
    } catch (error) {
        console.error("Error loading the car data:", error);
    }
}

// 車両データをHTMLに反映する関数
function populateCars(data) {
    Object.keys(data).forEach(category => {
        const categoryContainer = document.getElementById(category);
        categoryContainer.innerHTML = ''; // 現在のコンテンツをクリア

        data[category].forEach(car => {
            const carItem = document.createElement('div');
            carItem.classList.add('car-item');

            const carImage = document.createElement('img');
            carImage.src = car.image;
            carImage.alt = `${car.name} Image`;
            carItem.appendChild(carImage);

            const carName = document.createElement('div');
            carName.classList.add('car-name');
            carName.textContent = car.name;
            carItem.appendChild(carName);

            const carPrice = document.createElement('div');
            carPrice.classList.add('car-price');
            carPrice.textContent = `価格: ${car.price}`;
            carItem.appendChild(carPrice);

            categoryContainer.appendChild(carItem);
        });
    });
}

// カテゴリを切り替える関数
function showCategory(category, button) {
    document.querySelectorAll('.catalog').forEach(catalog => {
        catalog.style.display = 'none';
    });
    document.querySelectorAll('.category-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(category).style.display = 'flex';
    button.classList.add('active');
}

// 検索機能
function searchCar() {
    let searchQuery = document.getElementById('searchInput').value.toLowerCase();
    let allCategories = ['sports', 'super', 'bike'];
    let found = false;

    // 各カテゴリを確認して検索
    for (let category of allCategories) {
        let allCars = document.querySelectorAll(`#${category} .car-item`);
        for (let car of allCars) {
            let carName = car.querySelector('.car-name').textContent.toLowerCase();
            if (carName.includes(searchQuery)) {
                // 見つかった車両があるカテゴリを表示
                showCategory(category, document.querySelector(`button[onclick="showCategory('${category}', this)"]`));
                car.scrollIntoView({ behavior: 'smooth', block: 'center' });
                found = true;
                break;
            }
        }
        if (found) break;  // 車両が見つかったらループを抜ける
    }

    if (!found) {
        alert('該当する車両が見つかりません');
    }
}

// ソート機能
let sortMode = "name"; // 初期状態はA-Z順

function toggleSort() {
    sortMode = sortMode === "name" ? "price" : "name";
    document.getElementById("sortButton").textContent = sortMode === "name" ? "A-Z / 価格" : "価格 / A-Z";
    sortCars();
}

function sortCars() {
    let categories = ["sports", "super", "bike"];

    categories.forEach(category => {
        let container = document.getElementById(category);
        let cars = Array.from(container.getElementsByClassName("car-item"));

        cars.sort((a, b) => {
            if (sortMode === "name") {
                let nameA = a.querySelector(".car-name").textContent.toLowerCase();
                let nameB = b.querySelector(".car-name").textContent.toLowerCase();
                return nameA.localeCompare(nameB, "ja"); // 日本語対応
            } else {
                let priceA = parseInt(a.querySelector(".car-price").textContent.replace(/[^0-9]/g, ""));
                let priceB = parseInt(b.querySelector(".car-price").textContent.replace(/[^0-9]/g, ""));
                return priceA - priceB; // 価格順
            }
        });

        // 並び替えた要素を再配置
        cars.forEach(car => container.appendChild(car));
    });
}

// ページ読み込み時の処理
window.onload = function() {
    loadCarsData(); // JSONデータを読み込み
    const sportsButton = document.querySelector("button[onclick=\"showCategory('sports', this)\"]");
    showCategory('sports', sportsButton);
};

