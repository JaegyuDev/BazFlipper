document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    const marginInput = document.getElementById("marginInput");
    const marginValue = document.getElementById("marginValue");
    const buyVolumeThreshold = document.getElementById("buyVolumeThreshold");
    const sellVolumeThreshold = document.getElementById("sellVolumeThreshold");
    const buyPriceThreshold = document.getElementById("buyPriceThreshold");
    const productList = document.getElementById("productList");

    searchBox.addEventListener("input", updateListView);
    marginInput.addEventListener("change", updateListView);
    buyVolumeThreshold.addEventListener("change", updateListView);
    sellVolumeThreshold.addEventListener("change", updateListView);
    buyPriceThreshold.addEventListener("change", updateListView);

    function hRLN(number) {
        // us default, might change later for you euro folk
        return number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    async function fetchDataFromApi() {
        try {
            const response = await fetch("https://api.hypixel.net/v2/skyblock/bazaar");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error("Fetching data failed", error);
            return null;
        }
    }

    function filterProducts(productsData, margin, buyVolumeThreshold, sellVolumeThreshold, buyPrice, searchQuery) {
        return Object.entries(productsData)
            .map(([key, value]) => {
                const quickStatus = value.quick_status;
                const buyPrice = quickStatus.buyPrice;
                const sellPrice = quickStatus.sellPrice;
                const marginValue = buyPrice - sellPrice;
                const marginPercentage = (marginValue / sellPrice) * 100;
                const buyVolume = quickStatus.buyVolume;
                const sellVolume = quickStatus.sellVolume;

                return {
                    productId: key,
                    buyPrice,
                    sellPrice,
                    margin: marginValue,
                    marginPercentage,
                    buyVolume,
                    sellVolume,
                };
            })
            .filter(product =>
                product.buyPrice >= buyPrice &&
                product.sellPrice > 0 &&
                product.marginPercentage >= margin &&
                product.buyVolume >= buyVolumeThreshold &&
                product.sellVolume <= sellVolumeThreshold &&
                product.productId.toLowerCase().includes(searchQuery.toLowerCase().replace(" ", "_"))
            );
    }

    const refreshButton = document.getElementById("refreshButton");
    refreshButton.addEventListener("click", updateListView);

    async function updateListView() {
        const margin = parseFloat(marginInput.value);
        const buyVolumeThresholdValue = parseInt(buyVolumeThreshold.value);
        const sellVolumeThresholdValue = parseInt(sellVolumeThreshold.value);
        const buyPriceValue = parseInt(buyPriceThreshold.value);
        const searchQuery = searchBox.value;

        const productsData = await fetchDataFromApi();
        if (!productsData) return;

        const filteredProducts = filterProducts(productsData, margin, buyVolumeThresholdValue, sellVolumeThresholdValue, buyPriceValue, searchQuery);

        productList.innerHTML = "";
        filteredProducts.forEach(product => {
            const li = document.createElement("li");
            li.textContent = `${product.productId}`;

            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.innerHTML = `
                Margin: ${hRLN(product.margin)}<br>

                Buy Price: ${hRLN(product.buyPrice)}<br>
                Sell Price: ${hRLN(product.sellPrice)}<br>
                Margin: ${hRLN(product.marginPercentage)}%<br>
                Buy Volume: ${hRLN(product.buyVolume)}<br>
                Sell Volume: ${hRLN(product.sellVolume)}
            `;

            li.appendChild(tooltip);
            productList.appendChild(li);

            li.addEventListener("mouseover", () => {
                const rect = tooltip.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    tooltip.style.top = "auto";
                    tooltip.style.bottom = "100%";
                } else {
                    tooltip.style.top = "100%";
                    tooltip.style.bottom = "auto";
                }
            });
        });

        console.info("updated view")
    }

    updateListView();

    setInterval(updateListView, 15000);
});
