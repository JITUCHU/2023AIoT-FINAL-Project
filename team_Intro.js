let teamMembers = [
    {
        name: "진용우",
        position: "팀원",
        description: "진용우진용우진용우진용우진용우진용우진용우진용우진용우진용우입니다.",
        photo: "./images/진용우소개임시.png"
    },
    {
        name: "최준형",
        position: "팀원",
        description: "최준형최준형최준형최준형최준형최준형최준형최준형최준형최준형입니다.",
        photo: "./images/최준형소개임시.png"
    },
    {
        name: "황지수",
        position: "팀장",
        description: "황지수황지수황지수황지수황지수황지수황지수황지수황지수황지수입니다.",
        photo: "./images/황지수소개.jpg"
    }
];

let images = [];
let masks = [];

function preload() {
    for (let i = 0; i < teamMembers.length; i++) {
        images[i] = loadImage(teamMembers[i].photo);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < images.length; i++){
        masks[i] = createGraphics(150, 150);
        masks[i].background(255);
        masks[i].ellipse(75, 75, 150, 150);
    }
}

function draw() {
    background(0); // 검정색 배경

    // 각 팀원의 정보를 순회하면서 표시합니다.
    for (let i = 0; i < images.length; i++) {

        images[i].mask(masks[i]);

        let x = (i + 1) * 200;
        let y = 100;
        // 각 팀원의 이미지를 그립니다.
        // 예시: image(member.photo, x좌표, y좌표, 이미지 너비, 이미지 높이);
        image(images[i], x, y, 150, 150);
        
        if (mouseX >= x && mouseX <= x + 150 && mouseY >= y && mouseY <= y + 150){
            displayInfo(teamMembers[i]);
        }
    }
}

function displayInfo(member) {
    // 마우스 이벤트를 사용하여 각 팀원의 정보를 표시합니다.
    // 마우스가 특정 팀원 이미지 위에 있을 때 해당 정보를 화면에 표시하세요.
    textSize(20);
    fill(255);
    text(member.name, 250, 300);
    text(member.position, 250, 330);
    text(member.description, 250, 360);
}