let carsData = {}; // JSONデータを保持する変数
let sortMode = "name"; // デフォルトの並び順（A-Z）
let orderMode = "asc"; // デフォルトの昇順

// JSONデータの読み込み関数
async function loadCarsData() {
    try {
        const response = await fetch('cars.json'); // JSONデータを取得
        carsData = await response.json();
        renderCars(); // 初期データを表示
    } catch (error) {
        console.error("Error loading the car data:", error);
    }
}

// 車両データをHTMLに反映する関数（並び替え対応）
function renderCars() {
    Object.keys(carsData).forEach(category => {
        const categoryContainer = document.getElementById(category);
        categoryContainer.innerHTML = ''; // 一度リセット

        // ソートしたデータを取得
        let sortedCars = [...carsData[category]];
        sortedCars.sort(compareCars);

        sortedCars.forEach(car => {
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

// ソート条件に基づいて比較する関数
function compareCars(a, b) {
    if (sortMode === "name") {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        return orderMode === "asc" ? nameA.localeCompare(nameB, "ja") : nameB.localeCompare(nameA, "ja");
    } else {
        let priceA = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
        let priceB = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
        return orderMode === "asc" ? priceA - priceB : priceB - priceA;
    }
}

// 並び替えモードを切り替える
function toggleSort() {
    sortMode = sortMode === "name" ? "price" : "name";
    
    // 並び替えボタンのテキストを更新
    document.getElementById("sortButton").textContent = sortMode === "name" ? "A-Z" : "価格";
    
    renderCars();
}

// 昇順・降順を切り替える
function toggleOrder() {
    orderMode = orderMode === "asc" ? "desc" : "asc";
    document.getElementById("orderButton").textContent = orderMode === "asc" ? "昇順" : "降順";
    renderCars();
}

// カテゴリを切り替える
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

    for (let category of allCategories) {
        let allCars = document.querySelectorAll(`#${category} .car-item`);
        for (let car of allCars) {
            let carName = car.querySelector('.car-name').textContent.toLowerCase();
            if (carName.includes(searchQuery)) {
                showCategory(category, document.querySelector(`button[onclick="showCategory('${category}', this)"]`));
                car.scrollIntoView({ behavior: 'smooth', block: 'center' });
                found = true;
                break;
            }
        }
        if (found) break;
    }

    if (!found) {
        alert('該当する車両が見つかりません');
    }
}

// ページ読み込み時の処理
window.onload = function() {
    loadCarsData();
    const sportsButton = document.querySelector("button[onclick=\"showCategory('sports', this)\"]");
    showCategory('sports', sportsButton);
};
