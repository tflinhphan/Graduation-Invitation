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

    // Tạo đối tượng âm thanh cho nhạc nền
    const bgMusic = new Audio('assets/sounds/music.mp3');
    bgMusic.loop = true;

    // Hàm cho các vật phẩm bay ra màn hình và phát nhạc
    function spreadOutItems() {
        sceneContainer.classList.add("spread-out");
        isSpread = true;
        
        bgMusic.play().then(() => {
            vinylItem.classList.add("music-playing");
            vinylItem.classList.remove("music-paused");
        }).catch(err => {
            console.log("Autoplay blocked or play failed:", err);
            // Vẫn cho đĩa quay bằng CSS animation dù chưa có tương tác âm thanh trực tiếp
            vinylItem.classList.add("music-playing");
            vinylItem.classList.remove("music-paused");
        });
        console.log("Items spread out! isSpread:", isSpread);
    }

    // Hàm thu hồi các vật phẩm về bao thư và tắt nhạc
    function returnItems() {
        sceneContainer.classList.remove("spread-out");
        isSpread = false;
        
        bgMusic.pause();
        bgMusic.currentTime = 0; // reset nhạc về đầu
        vinylItem.classList.remove("music-playing", "music-paused");
        console.log("Items returned! isSpread:", isSpread);
    }

    // Bật/tắt xoay đĩa và phát nhạc riêng biệt khi click vào đĩa ở trạng thái bay ra
    function toggleVinylMusic() {
        if (vinylItem.classList.contains("music-playing")) {
            bgMusic.pause();
            vinylItem.classList.remove("music-playing");
            vinylItem.classList.add("music-paused");
            console.log("Vinyl music paused");
        } else {
            bgMusic.play().then(() => {
                vinylItem.classList.add("music-playing");
                vinylItem.classList.remove("music-paused");
                console.log("Vinyl music playing");
            }).catch(err => {
                console.log("Play failed:", err);
            });
        }
    }

    // Hàm xử lý việc bay ra / thu hồi các vật phẩm khi click ảnh hoặc thiệp
    function toggleSpread(event) {
        console.log("toggleSpread clicked! Element:", event.currentTarget.id, "isLetterOpen:", isLetterOpen, "isSpread:", isSpread);
        if (!isLetterOpen) {
            console.log("toggleSpread return because letter is not open!");
            return;
        }
        event.stopPropagation();

        if (!isSpread) {
            spreadOutItems();
        } else {
            returnItems();
        }
    }

    // 2. Nhấp vào các vật phẩm để bay ra / thu hồi
    photoItem.addEventListener("click", toggleSpread);
    
    // Đĩa than có xử lý bật/tắt nhạc và dừng xoay riêng biệt
    vinylItem.addEventListener("click", function(event) {
        console.log("Vinyl clicked! isLetterOpen:", isLetterOpen, "isSpread:", isSpread);
        if (!isLetterOpen) return;
        event.stopPropagation();

        if (!isSpread) {
            spreadOutItems();
        } else {
            toggleVinylMusic();
        }
    });

    cardItem.addEventListener("click", toggleSpread);

    // 3. Nhấp vào vùng chứa bức thư (cả lớp mặt trước và mặt sau)
    function handleEnvelopeClick(event) {
        console.log("handleEnvelopeClick! Target:", event.target, "CurrentTarget:", event.currentTarget.id, "isLetterOpen:", isLetterOpen, "isSpread:", isSpread);
        event.stopPropagation();

        if (isLetterOpen) {
            if (isSpread) {
                // Nếu đang bay ra, thu hồi lại vào trong thư trước
                returnItems();
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

// Tự động kích hoạt hiệu ứng xòe ảnh khi cuộn tới vị trí
document.addEventListener("DOMContentLoaded", () => {
    const polaroidSection = document.getElementById("polaroidSection");

    if (polaroidSection) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                // Vừa chạm 10% mép dưới màn hình là kích hoạt xòe ngay
                if (entry.isIntersecting) {
                    polaroidSection.classList.add("active");
                    obs.unobserve(polaroidSection); // Giữ trạng thái xòe cố định sau khi kích hoạt
                }
            });
        }, {
            threshold: 0.1, // Nhận diện cực nhạy khi vừa lướt tới
            rootMargin: "0px 0px -50px 0px" 
        });

        observer.observe(polaroidSection);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Đọc tham số URL
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to') || urlParams.get('name');

    // 2. Điền tên vào thiệp nếu có tham số trên link
    const guestElement = document.getElementById("guestName");
    if (guest && guestElement) {
        guestElement.textContent = guest;
    }
});