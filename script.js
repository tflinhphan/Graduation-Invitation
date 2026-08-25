document.addEventListener("DOMContentLoaded", function() {
    const sceneContainer = document.getElementById("sceneContainer");
    const lockButton = document.getElementById("lockButton");
    const envelopeContainer = document.getElementById("envelopeContainer");
    const closedLetter = envelopeContainer.querySelector(".closed-letter");
    const itemsContainer = document.getElementById("itemsContainer");
    const photoItem = document.getElementById("photoItem");
    const vinylItem = document.getElementById("vinylItem");
    const cardItem = document.getElementById("cardItem");
    
    // Theo dõi trạng thái
    let isLetterOpen = false;
    let isSpread = false;

    console.log("Script loaded. Initial states - isLetterOpen:", isLetterOpen, "isSpread:", isSpread);

    // 1. Nhấn nút khóa (sáp seal) để mở thư
    lockButton.addEventListener("click", function(event) {
        console.log("lockButton clicked!");
        event.stopPropagation(); // Ngăn lan truyền click

        if (!isLetterOpen) {
            // Hiệu ứng sáp bay mất
            lockButton.classList.add("disappear");
            
            // Ẩn thư đóng
            closedLetter.classList.add("hidden");
            
            // Kích hoạt trạng thái mở thư trên container chính để hiện 3 vật phẩm
            sceneContainer.classList.add("envelope-opened");
            
            isLetterOpen = true;
            console.log("Envelope opened! isLetterOpen:", isLetterOpen);
        }
    });

    // Hàm xử lý việc bay ra / thu hồi các vật phẩm
    function toggleSpread(event) {
        console.log("toggleSpread clicked! Element:", event.currentTarget.id, "isLetterOpen:", isLetterOpen, "isSpread:", isSpread);
        if (!isLetterOpen) {
            console.log("toggleSpread return because letter is not open!");
            return;
        }
        event.stopPropagation();

        if (!isSpread) {
            // Nếu chưa bay ra, cho bay ra toàn màn hình
            sceneContainer.classList.add("spread-out");
            isSpread = true;
            console.log("Items spread out! isSpread:", isSpread);
        } else {
            // Nếu đang bay ra, thu hồi lại vào trong thư
            sceneContainer.classList.remove("spread-out");
            isSpread = false;
            console.log("Items returned! isSpread:", isSpread);
        }
    }

    // 2. Nhấp vào các vật phẩm để bay ra / thu hồi
    photoItem.addEventListener("click", toggleSpread);
    vinylItem.addEventListener("click", toggleSpread);
    cardItem.addEventListener("click", toggleSpread);

    // 3. Nhấp vào vùng chứa bức thư (cả lớp mặt trước và mặt sau)
    function handleEnvelopeClick(event) {
        console.log("handleEnvelopeClick! Target:", event.target, "CurrentTarget:", event.currentTarget.id, "isLetterOpen:", isLetterOpen, "isSpread:", isSpread);
        event.stopPropagation();

        if (isLetterOpen) {
            if (isSpread) {
                // Nếu đang bay ra, thu hồi lại vào trong thư trước
                sceneContainer.classList.remove("spread-out");
                isSpread = false;
                console.log("Envelope click: items returned! isSpread:", isSpread);
            } else {
                // Nếu đang ở trong thư, đóng thư lại
                lockButton.classList.remove("disappear");
                closedLetter.classList.remove("hidden");
                sceneContainer.classList.remove("envelope-opened");
                
                isLetterOpen = false;
                console.log("Envelope click: envelope closed! isLetterOpen:", isLetterOpen);
            }
        }
    }

    envelopeContainer.addEventListener("click", handleEnvelopeClick);
    
    const envelopeBackContainer = document.getElementById("envelopeBackContainer");
    if (envelopeBackContainer) {
        envelopeBackContainer.addEventListener("click", handleEnvelopeClick);
    }
});