<p align="center">
  <img width="200" height="100" alt="lumia-logo2" src="https://github.com/user-attachments/assets/b2718c66-56d1-4202-952d-5f5137834d06" />
</p>
<p align="center">
  <b>발표는 발표자만의 무대가 아닙니다.</b><br />
</p>
<p align="center">
  <b>Lumia</b>를 통해 청중의 시선과 생각이 실시간으로 전달되는
양방향 발표를 만들어갈 수 있습니다.
</p>

<p align="center">
  <a href="https://www.lumia.io.kr/">배포 사이트</a>
</p>


<br />

<h1>
  <img src="https://img.icons8.com/ios/50/overview-pages-1.png" width="25" style="vertical-align: middle;" />
  목차
</h1>

- [**기획 배경**](#기획-배경)
- [**기술 스택**](#기술-스택)
- [**주요 기능**](#주요-기능)
- [**개발 과정**](#개발-과정)
  - [1. PDF 슬라이드는 어떻게 업로드되고 저장될까?](#1-pdf-슬라이드는-어떻게-업로드되고-저장될까)
    - [1-1. 드래그 상태를 안정적으로 감지하는 방식](#1-1-드래그-상태를-안정적으로-감지하는-방식)
    - [1-2. drop 이벤트가 정상 작동하도록 브라우저의 기본 동작 차단](#1-2-drop-이벤트가-정상-작동하도록-브라우저의-기본-동작-차단)
    - [1-3. 메모리 기반 파일 처리 및 S3 업로드](#1-3-메모리-기반-파일-처리-및-s3-업로드)
  - [2. 발표자와 청중의 상호작용, 어떻게 실시간으로 동기화했을까?](#2-발표자와-청중의-상호작용-어떻게-실시간으로-동기화했을까)
    - [2-1. 발표방 단위 통신 구조](#2-1-발표방-단위-통신-구조)
    - [2-2. 서버 상태 저장소: roomStore](#2-2-서버-상태-저장소-roomstore)
    - [2-3. 입장 시 초기 상태 동기화](#2-3-입장-시-초기-상태-동기화)
    - [2-4. 주요 실시간 동기화 흐름](#2-4-주요-실시간-동기화-흐름)
  - [3. 주석을 어떻게 화면 해상도에 상관없이 항상 일정한 위치에 그릴 수 있을까?](#3-주석을-어떻게-화면-해상도에-상관없이-항상-일정한-위치에-그릴-수-있을까)
    - [3-1. zustand 기반 주석 상태 설계](#3-1-zustand-기반-주석-상태-설계)
    - [3-2. 주석 그리기: 실시간 드로잉과 렌더링 흐름](#3-2-주석-그리기-실시간-드로잉과-렌더링-흐름)
    - [3-3. 해상도 변화에도 정확히 표시되는 정규화 구조와 반응형 정렬](#3-3-해상도-변화에도-정확히-표시되는-정규화-구조와-반응형-정렬)
    - [3-4. 주석의 실시간 공유와 청중 입장 시 복원 로직](#3-4-주석의-실시간-공유와-청중-입장-시-복원-로직)
- [**개발 일정**](#개발-일정)
- [**회고록**](#회고록)

<br />

<h1 id="기획-배경">
  <img src="https://img.icons8.com/windows/32/idea--v1.png" width="25" style="vertical-align: middle;" />
  기획 배경
</h1>

> **발표자는 이끌지만, 청중의 반응이 방향을 정합니다.**

강의나 발표를 들을 때 아쉬운 순간이 있었습니다. 중요한 내용을 놓쳤을 때나, 설명이 너무 빨리 지나갔을 때,<br />
그 자리에서 즉시 반응을 자연스럽게 표현할 방법이 마땅치 않았습니다.<br />

손을 들어 질문하기엔 흐름이 끊기고, 강의가 끝난 뒤에는 질문할 타이밍을 놓치거나,<br />
무엇을 놓쳤는지조차 흐릿해지는 경우가 있었습니다.<br />

**궁금증이 생긴 바로 그 순간, 내 반응이 바로 드러날 수 있다면 어떨까?**<br />

이 질문이 **Lumia**의 출발점이 되었고, **청중의 이해를 중심에 둔 양방향 발표**를 꿈꾸며 **Lumia**를 기획하게 되었습니다.
<br />

**Lumia**는 발표 중 청중이 궁금하거나 놓친 부분을 마우스 커서 움직임이나 채팅으로 즉시 표현할 수 있게 해주고,<br />
그 피드백은 실시간으로 발표자 화면에 시각화됩니다.<br />

발표자는 청중의 흐름에 맞춰 발표를 유연하게 조정할 수 있고, 청중은 손을 들지 않아도 쉽게 반응을 전달할 수 있습니다.<br />

<br />

<h1 id="기술-스택">
  <img src="https://img.icons8.com/ios/50/settings--v1.png" width="25" style="vertical-align: middle;" />
  기술 스택
</h1>

### 프론트엔드

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=redux&logoColor=white)

### 백엔드
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white) ![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Multer](https://img.shields.io/badge/Multer-black?style=for-the-badge&logoColor=white) ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white) 

### 개발 도구

![Git](https://img.shields.io/badge/git-%23F05032.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E) ![Husky](https://img.shields.io/badge/husky-000000?style=for-the-badge&logo=husky&logoColor=white)

<br />

<h1 id="주요-기능">
  <img src="https://img.icons8.com/ios/50/control-panel--v2.png" width="25" style="vertical-align: middle;" />
  주요 기능
</h1>

## **1. 발표 준비**
### **슬라이드 업로드 & 발표방 생성**
- 발표자는 PDF 슬라이드를 업로드하여 발표방을 생성할 수 있습니다.
- 업로드된 슬라이드는 웹에서 즉시 확인 가능한 PDF 뷰어 형태로 표시됩니다.
- 발표자는 발표방의 고유 링크를 복사하여 청중과 공유할 수 있고, 청중은 해당 링크를 통해 발표에 참여할 수 있습니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/d8b95213-469a-4d25-a6fe-7e1c83ee3bba" />
</p>

<br />

## **2. 실시간 발표**
### **슬라이드 동기화**
- 발표자의 슬라이드 전환은 청중 화면에 실시간 동기화되어 동일한 흐름을 유지할 수 있습니다.
- 청중은 ‘발표자 흐름 따라가기’를 ON/OFF 하며 필요 시 자유롭게 슬라이드를 탐색할 수 있습니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/9442e3d0-f410-4632-9e37-fc311ab233aa" />
</p>

<br />

### **주석 작성 & 공유**
- 발표자는 펜, 형광펜, 지우개, 도형 도구를 이용해 슬라이드에 주석을 작성할 수 있습니다.
- 주석 데이터는 좌표 정규화(0~1) 기반으로 저장/전송되어, 브라우저 해상도와 무관하게 같은 위치에 정확히 반영됩니다.
- 페이지별로 주석이 관리되며, 중간 합류한 청중도 기존 주석을 초기 렌더링해 동일한 화면을 볼 수 있습니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/7ec0e78d-37f9-496b-b730-bb7f1c5f37cd" />
</p>

<br />

## **3. 실시간 청중 피드백**
### **커서 공유**
- 청중은 마우스 커서를 통해 발표 중 주목하는 부분이나 궁금한 위치를 실시간으로 표현할 수 있습니다.
- 발표자는 모든 청중의 커서를 실시간으로 확인할 수 있으며, 필요 시 해당 기능을 비활성화할 수 있습니다.
- 청중도 자신의 커서 공유 여부를 개별적으로 선택할 수 있어, 피드백 방식에 대한 자율성을 보장합니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/f59362f6-f605-441d-93d8-312d18ba0c8f" />
</p>


### **텍스트 피드백(채팅)**
- 청중은 채팅창을 통해 발표 중 궁금한 점이나 의견을 자유롭게 전달할 수 있습니다.
- 각 메시지에는 작성 당시 페이지 정보가 함께 표시되어, 어느 슬라이드에서 작성된 피드백인지 쉽게 파악할 수 있습니다.
- 페이지를 이동해도 메시지는 유지되며, 읽지 않은 메시지가 있을 경우 채팅 아이콘 옆에 알림이 표시됩니다.


<p align="center">
  <img src="https://github.com/user-attachments/assets/335321ac-0228-43ed-9637-7fd60cac3f02" />
</p>

<br />

## 4. 발표 종료
### **주석 포함 pdf 저장**
- 발표자가 발표 종료 시, 모든 참여자에게 주석이 포함된 슬라이드 PDF 저장 안내 모달이 표시됩니다.
- 다운로드 진행 중에는 프로그레스바로 상태를 표시하며, 완료 후 홈 화면으로 이동됩니다.
<p align="center">
  <img src="https://github.com/user-attachments/assets/c9324cdb-eed9-45c4-a09d-8bd59d11c032" />
</p>

### **발표 자료 만료 처리**
- 발표 종료와 동시에 슬라이드 및 관련 데이터가 삭제되어 더 이상 접근할 수 없습니다.
- 해당 링크로 재접속 시 Not Found UI가 표시되며 홈 화면으로 안내됩니다.
<img width="1912" height="967" src="https://github.com/user-attachments/assets/90a1ddaa-891a-42dd-b7fb-8dcf13c082c8" />


<br />
<br />

<h1 id="개발-과정">
  <img src="https://img.icons8.com/ios-filled/50/journey.png" width="25" style="vertical-align: middle;" />
  개발 과정
</h1>

## 1. PDF 슬라이드는 어떻게 업로드되고 저장될까?
발표를 시작하기 전, 사용자는 PDF 슬라이드를 업로드해야 합니다.<br />
사용자의 편의를 위해 **클릭과 드래그 앤 드롭을 모두 지원**하는 업로드 UI를 제공하고 있으며,<br />
업로드된 PDF는 **서버를 거쳐 S3**에 저장되며, 클라이언트는 **즉시 열람 가능한 S3 공개 URL**을 전달받아 PDF 뷰어에 연결합니다.

<br />

### **1-1. 드래그 상태를 안정적으로 감지하는 방식**

초기에는 단순히 `isDragging` 상태 하나로 드래그 중인지를 판단했습니다.
하지만 테스트 중, **마우스를 드래그할 때 배경이 깜빡이는 현상**이 발생했습니다.

콘솔로 이벤트 흐름을 추적해보니, 브라우저가 `dragenter`, `dragleave`를 **DOM 요소 단위로 발생**시키고 있었습니다.<br />

즉, **마우스가 부모-자식 요소 사이를 오가는 것만으로도 이벤트가 반복해서 발생**했고 <br />
그 결과 `isDragging` 값이 짧은 시간 내에 계속 변경되며 드래그 중 유지되어야 할 배경이 깜빡이는 문제가 발생했습니다. <br />

<br />

> [!warning]
> 브라우저는 부모-자식 요소 간의 마우스 이동에도 `dragenter` / `dragleave` 이벤트를 계속 발생시킵니다.
> 단순 `Boolean` 상태로는 **실제 드래그 종료를 감지하기 어렵습니다.**
<br />

이 문제를 해결하기 위해, 단일 상태가 아닌 **드래그 진입 횟수를 세는 카운터 방식**으로 로직을 변경했습니다.<br />


```javascript
const dragCounter = useRef(0);

const handleDragEnter = () => {
  dragCounter.current += 1;
  setIsDragging(true);
};

const handleDragLeave = () => {
  dragCounter.current -= 1;
  if (dragCounter.current === 0) {
    setIsDragging(false);
  }
};
```

이 방식의 핵심은, **마우스가 요소들 사이를 오갈 때는 `+1` / `-1`로 상쇄**되기 때문에 <br />
실제로 **마우스가 완전히 영역 밖으로 나갔을 때만 카운터가 `0`이 되어, 드래그 종료로 감지**할 수 있다는 점입니다.

덕분에 복잡한 DOM 구조에서도 안정적으로 드래그 중 상태를 감지할 수 있게 되었고,<br />
사용자 입장에서도 배경이 깜빡이지 않는 일관된 UX를 제공할 수 있었습니다.

<br />

### **1-2. drop 이벤트가 정상 작동하도록 브라우저의 기본 동작 차단**

PDF를 업로드하려고 페이지에 드래그해서 놓았을 때,<br />
브라우저가 해당 파일을 새 탭에서 열거나 다운로드하는 문제가 발생했습니다.

이는 브라우저의 기본 동작이 먼저 적용되어, drop 이벤트 자체가 발생하지 않았기 때문입니다.

<br />

> [!warning]
> `dragover` 이벤트에서 `e.preventDefault()`를 호출하지 않으면,
> 브라우저가 drop을 허용하지 않아 새 탭에서 PDF가 열리거나 자동 다운로드됩니다.
<br />

`drop` 이벤트가 정상 동작하도록 `dragover` 이벤트에서 `e.preventDefault()`를 호출해, 브라우저 기본 동작을 차단했습니다.

<br />

### **1-3. 메모리 기반 파일 처리 및 S3 업로드**
클라이언트에서 업로드된 PDF 파일은 `multipart/form-data` 형식으로 서버에 전송되며,
서버는 `Multer` 미들웨어를 활용해 이를 처리합니다.

이때, `Multer`의 `memoryStorage` 방식으로 처리하도록 구성했습니다.

```javascript
const storage = multer.memoryStorage();
const upload = multer({ storage });
```
<br />

> [!note]
> `memoryStorage`는 업로드된 파일을 디스크에 저장하지 않고, 메모리에서 직접 읽어 `S3`에 업로드하는 방식입니다.<br />
> 디스크 I/O를 거치지 않아 **업로드 속도가 빠르고 서버 리소스 사용도 최소화할 수 있습니다**.
<br />

메모리에서 읽어들인 PDF 파일은 `req.file.buffer`를 통해 접근할 수 있으며, <br />
해당 데이터를 그대로 `AWS SDK`의 `PutObjectCommand`를 이용해 `S3` 버킷에 업로드합니다.

```javascript
const fileKey = `${Date.now()}_${file.originalname}`;

const command = new PutObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: fileKey,
  Body: file.buffer,
  ContentType: file.mimetype, // application/pdf
});
```
> 업로드 처리 시 고려한 사항
>	- **고유한 파일명 처리**: `Date.now()`를 조합해 중복 방지
> - **`ContentType` 지정**: 브라우저가 PDF로 인식할 수 있도록 명시
> - **퍼블릭 접근 허용**: 발표자가 URL로 바로 사용할 수 있도록 접근 권한 설정

<br />

업로드가 완료되면 즉시 접근 가능한 **S3 공개 URL**을 클라이언트에 전달합니다.
<br />

<div align="center">
<strong>https://{bucket}.s3.{region}.amazonaws.com/{fileKey}</strong>
</div>

<br />
해당 URL은 별도의 인증 없이 누구나 접근할 수 있으며, PDF 뷰어에서 슬라이드를 렌더링하는 데 사용됩니다.


<br />
<br />

## 2. 발표자와 청중의 상호작용, 어떻게 실시간으로 동기화했을까?

발표자와 청중 간의 상호작용을 실시간으로 전달하기 위해 **`WebSocket` 기반 양방향 통신 구조**를 설계하였습니다.
PDF 슬라이드 전환부터 커서 공유, 주석, 채팅에 이르기까지 다양한 사용자 이벤트를 서버를 거쳐 실시간으로 동기화합니다.

<br />

> [!important]
> **왜 WebSocket인가?**
> |            | WebSocket           | SSE (Server-Sent Events) | HTTP Polling         |
> |------------|---------------------|---------------------------|------------------------|
> | 통신 방향  | 양방향              | 단방향 (서버 → 클라이언트) | 요청-응답 기반         |
> | 연결 방식  | 1회 연결 후 지속    | 1회 연결 후 지속          | 요청마다 새 연결 발생   |
> | 실시간성   | 매우 우수           | 알림 용도에 적합          | 제한적                 |
>
> **Lumia는 상호작용 기반의 양방향 이벤트가 핵심**입니다.
> 단방향인 SSE나 Polling 구조로는 실시간 공유에 한계가 있으며,
> 다양한 이벤트를 안정적으로 처리하기 위해 **WebSocket을 채택**하였습니다.

<br />

### 2-1. 발표방 단위 통신 구조

모든 소켓 통신은 발표방의 고유 ID를 기준으로 분리되며, 각 방마다 독립적인 실시간 통신이 보장됩니다.

```js
socket.on("join_room", ({ roomId }) => {
  socket.join(roomId);
});
```
- `join_room` 이벤트를 통해 소켓이 특정 방에 입장하면, 해당 방의 사용자에게만 이벤트가 전파됩니다.
- 이를 통해 다수의 발표방이 동시에 운영되더라도 상태 충돌 없이 통신이 독립적으로 유지됩니다.

<br />

### 2-2. 서버 상태 저장소: roomStore

서버는 발표방별 상태를 **메모리 기반의 저장소: roomStore**에 보관하며,<br />
모든 실시간 동기화의 중심에서 상태를 일관되게 유지합니다.

```js
const roomStore = new Map();
// 구조: { roomId: { slideUrl, currentPage, drawings, feedbacks } }
```

- 각 발표방마다 슬라이드 URL, 현재 페이지, 주석, 피드백 정보를 개별 저장합니다.
- 사용자가 새로고침하거나 재입장하더라도, 서버는 기존 상태를 유지하고 다시 전달합니다.
- 발표 종료 시 해당 방의 정보는 메모리에서 제거됩니다.
- 현재는 서버 메모리에 저장하지만, 추후 DB로의 확장이 가능하도록 Map 구조로 유연하게 설계했습니다.
<br />

> [!note]
> 서버는 모든 발표방 상태를 관리하는 **Single Source of Truth**입니다.
> 클라이언트의 요청에 따라 상태를 갱신하고 전체 사용자에게 전파합니다.


<br />

### 2-3. 입장 시 초기 상태 동기화
사용자가 발표방에 입장하면, **서버는 해당 방의 현재 상태 전체를 클라이언트로 전송해 초기 동기화**를 수행합니다.

```js
// 서버 -> 클라이언트
// 클라이언트에 초기 상태 전달
socket.emit("init_room", {
  slideUrl: room.slideUrl,
  currentPage: room.currentPage,
  feedbacks: room.feedbacks || [],
  drawings: room.drawings || {},
});

// 클라이언트에서 수신
socket.on("init_room", ({ slideUrl, currentPage, drawings, feedbacks }) => {
  // 전달받은 상태로 클라이언트 화면 구성
});
```

- 사용자가 `join_room` 이벤트로 입장 요청을 보내면, 서버는 해당 방의 전체 상태 정보를 클라이언트로 전달합니다.
- 클라이언트는 전달받은 상태를 바탕으로 슬라이드 페이지, 주석, 피드백 등을 초기화하여 화면을 구성합니다.
  
<br />

### 2-4. 주요 실시간 동기화 흐름

모든 실시간 이벤트는 서버 상태 변경을 중심으로 설계되었으며,<br />
**요청 -> 서버 상태 갱신 -> 전체 사용자에게 전파** 순서로 처리됩니다.

| 기능           | 요청자           | 서버 처리           | 수신자           | 설명 |
|----------------|------------------|----------------------|------------------|-------|
| 슬라이드 전환   | 발표자            | 현재 페이지 갱신     | 청중              | 발표자가 슬라이드를 넘기면, 서버가 상태를 갱신한 뒤 전체 사용자에게 전송합니다. |
| 커서 좌표       | 청중              | 커서 위치 중계       | 발표자            | 청중의 정규화된 커서 좌표를 서버가 받아 발표자에게 전달합니다. |
| 주석           | 발표자            | 주석 path 저장       | 청중              | 발표자가 그린 주석을 서버가 저장하고 청중에게 전파합니다. |
| 채팅 메시지     | 발표자 + 청중     | 채팅 저장            | 발표자 + 청중     | 메시지를 서버에 저장한 후 전체 사용자에게 브로드캐스트합니다. |


<br />

## 3. 주석을 어떻게 화면 해상도에 상관없이 항상 일정한 위치에 그릴 수 있을까?
슬라이드 위에 선을 그리는 단순한 기능처럼 보이지만,<br />
해상도에 따라 좌표가 달라지고, 실시간 동기화·페이지 전환·중간 입장 복원까지 고려하면 정교한 위치 계산과 상태 설계가 필요했습니다.

- 페이지별, 도구별로 구조화된 주석 데이터 관리
- 해상도에 상관없이 동일한 위치에 표시되도록 좌표 정규화
- PDF와 Canvas의 크기를 동기화한 정렬 구조
- 실시간 주석 공유 및 중간 입장자를 위한 초기 복원 처리

<br />

### 3-1. zustand 기반 주석 상태 설계
<br />

>[!important]
> **왜 zustand를 선택했을까?**
> - 페이지 전환, 도구 선택, 실시간 동기화 등 다양한 상태를 컴포넌트 간에 공유하면서도 가볍게 관리 가능
> - canvas에 직접 그리는 로직(`renderPath()`)처럼 **React 생명주기와 무관한 외부 함수에서도 `getState()`로 상태 접근 가능**
<br />

```js
{
  activeTool: 'pen' | 'highlighter' | 'eraser', // 현재 도구
  penColor: string, // 펜 색상
  highlighterColor: string, // 형광펜 색상
  eraserMode: 'partial' | 'all', // 지우개 모드
  canvasRef: RefObject<HTMLCanvasElement>, // canvas 참조
  currentPage: number, // 현재 페이지
  pageDrawings: {
    1: { drawings: [path, path, ...] }, // 각 페이지별 주석 path 정보
    2: { drawings: [...] }
  }
}
```

각 슬라이드의 주석을 `pageDrawings`에 페이지 단위로 분리 저장함으로써, **주석 기능을 페이지 단위로 유연하게 제어할 수 있는 구조**를 만들었습니다.

<br />

>[!note]
> 주석을 페이지별로 관리함으로써 페이지 전환, 초기화, 동기화, 복원에 있어서 동일한 상태 구조를 재사용할 수 있습니다.


<br />


### 3-2. 주석 그리기: 실시간 드로잉과 렌더링 흐름
주석은 **마우스 이벤트** 기반으로 실시간으로 그려지며,
그려진 결과는 하나의 **`path` 객체**로 저장되고 이후 렌더링에 재활용됩니다.

<br />

🔍 **실시간 드로잉** 
- 발표자는 **mousedown -> mousemove -> mouseup** 동작을 통해 선을 그립니다.
- `canvas`의 **2D context API** (`ctx.moveTo`, `ctx.lineTo`)를 이용해 canvas에 직접 선을 시각적으로 그리면서, 동시에 좌표들을 배열로 누적 저장합니다.
- 마우스를 떼면 해당 경로를 상태에 저장하고, `path` 데이터가 완성됩니다.
- 도구에 따라 `path` 구성 방식이 달라집니다.
  - **펜 / 형광펜**: 좌표 배열과 스타일 정보를 기반으로 선을 구성
  - **지우개**: 기존 `path`를 삭제하지 않고, 해당 영역을 직접 지우는 사각형 `path`를 생성

```javascript
{
  type: "pen" | "highlighter" | 'eraser',
  color: "#00FF00",
  width: 2,
  alpha: 1.0,
  points: [{ x: 0.3, y: 0.4 }, { x: 0.31, y: 0.41 }, ...] // 정규화된 좌표
}
```
<br />

🔍 **렌더링**

주석을 그리고 나면, 그 경로는 상태에 저장되고 `renderPath()` 함수에 의해 캔버스에 다시 출력됩니다.

```javascript
renderPath(path, ctx, canvasWidth, canvasHeight);
```

`renderPath()` 함수는 저장된 좌표와 스타일 정보를 기반으로  
선을 그리거나(`ctx.lineTo`) 특정 영역을 지우는(`ctx.clearRect`) 작업을 수행합니다.

<br />

> [!note]
> **`renderPath()`는 언제 호출될까?**
>
> `renderPath()`는 주석 렌더링의 공통 진입점으로, 다음 모든 상황에서 호출됩니다.
> - 발표자가 직접 주석을 그린 후
> - 슬라이드 페이지를 넘겨 해당 페이지의 주석을 다시 표시할 때
> - 발표방에 처음 입장해 이전 주석을 복원할 때
<br />

이를 통해 주석은 그려지는 순간과 복원되는 모든 순간에 일관되게 렌더링될 수 있습니다.

<br />

### 3-3. 해상도 변화에도 정확히 표시되는 정규화 구조와 반응형 정렬
처음에는 마우스의 픽셀 좌표를 그대로 저장했지만, <br />
사용자마다 **브라우저 해상도와 뷰포트 크기가 다르기 때문에** 같은 좌표가 전혀 다른 위치에 렌더링되는 문제가 발생했습니다.

이 문제를 해결하기 위해, 모든 좌표를 캔버스 기준의 상대 좌표 (`0~1`) 로 변환하여 저장했습니다.

<br />

🔍 **좌표 정규화**
- **마우스 입력 좌표 -> 캔버스 크기 기준으로 정규화해 저장**
- **렌더링 시 -> 정규화된 좌표를 캔버스 크기에 맞게 다시 환산**

좌표 저장 시:
```js
x = (clientX - left) / width
y = (clientY - top) / height
```

렌더링 시:
```js
canvasX = x * canvas.width
canvasY = y * canvas.height
```

<br />

> [!note]
> 모든 좌표가 정규화되어 있기 때문에 실시간 공유 시에도 정확한 위치를 유지할 수 있습니다.

<br />

🔍 **PDF와 canvas의 반응형 정렬 구조**

정규화만으로는 충분하지 않습니다. **캔버스의 크기가 PDF의 크기와 다르면 주석의 위치가 정확히 일치하지 않을 수 있습니다.** <br />

이를 방지하기 위해 `ResizeObserver`를 활용하여 기준 컨테이너의 크기를 추적하고,  
PDF와 canvas 모두 동일한 크기로 동기화합니다.

이 구조는 단순히 화면을 겹쳐 보이게 만드는 수준을 넘어서,  
정규화된 좌표를 어떤 해상도에서도 일관되게 해석할 수 있도록 보장해줍니다.

<br />

### 3-4. 주석의 실시간 공유와 청중 입장 시 복원 로직
주석 기능은 **실시간 커뮤니케이션**이 핵심입니다.  
단순히 발표자가 그리는 것을 넘어서, **청중과의 실시간 공유**, **중간 입장 시의 복원**까지 고려한 구조가 필요했습니다.

이를 위해 주석은 그려지는 즉시 상태에 저장되며, 동시에 `socket`을 통해 전송 및 복원되는 구조로 설계했습니다.

<br />

🔍 **주석의 실시간 공유 흐름**

1. 발표자가 주석을 완성하면 `path` 정보가 상태에 저장됩니다.
2. 동시에 `socket`을 통해 서버로 전송됩니다.
3. 서버는 이를 같은 방의 모든 청중에게 브로드캐스팅합니다.
4. 청중은 해당 `path`를 받아 상태에 반영하고 `renderPath()`로 렌더링합니다.

덕분에 모든 청중은 주석 상태를 실시간으로 정확히 확인할 수 있습니다.

<br />

🔍 **중간에 입장한 청중도 동일한 화면을 보는 구조**

입장 시 이전 주석을 볼 수 있도록 하기 위해, 서버는 전체 페이지의 주석 데이터를 함께 전송합니다.

1. 청중이 방에 입장하면 `init_room` 이벤트 수신
2. 서버는 현재 페이지 및 전체 주석 상태(`drawings`)를 전달
3. 클라이언트는 이 데이터를 상태에 저장하고, 각 페이지별로 `renderPath()`를 통해 주석을 복원

이 덕분에 발표 도중 입장한 청중도 정확히 동일한 주석 상태를 확인할 수 있습니다.

<br />

<h1 id="개발-일정">
  <img src="https://img.icons8.com/material-outlined/96/calendar--v1.png" width="25" style="vertical-align: middle;" />
  개발 일정
</h1>

**프로젝트 기간: 2025. 06. 23 - 2025. 07. 17**

**1주차**
> 아이디어 선정 및 초기 환경 설정
- 아이디어 브레인스토밍 및 선정
- 칸반 보드 작성
- 개발 환경 초기 세팅

**2주차**
> 발표 흐름 및 주석 기능 구현
- S3를 활용한 슬라이드 업로드 및 발표방 생성 흐름 구축
- PDF 슬라이드 뷰어 구현 및 슬라이드 동기화
- 발표자 주석 도구 구현

**3주차**
> 청중 참여 및 피드백 기능 구현
- 청중 입장 흐름 및 발표 상태 동기화 구조 설계
- 커서 공유 기능 구현
- 텍스트 피드백(채팅) 기능 구현

**4주차**
> 발표 종료 처리 및 배포
- 주석 포함 PDF 다운로드 기능 구현
- 발표 자료 만료 처리
- 배포


<br />

<h1 id="회고록">
  <img src="https://img.icons8.com/hieroglyphs/64/pencil.png" width="25" style="vertical-align: middle;" />
  회고록
</h1>


이번 프로젝트에서는 클라이언트부터 서버까지 전반적인 **사용자 흐름을 처음부터 끝까지 직접 설계하고 구현하는 경험**을 할 수 있었습니다.<br />
기존에는 백엔드에서 제공하는 API를 활용해 프론트를 구현하는 역할에 머물렀다면, 이번에는 사용자의 흐름을 기준으로 어떤 구조가 필요한지 고민하며 전체 시스템을 설계했다는 점에서 특별한 도전이었습니다.

초기에는 익숙하지 않은 서버 개발과, 처음 접하는 소켓 통신 구조 때문에 막막함도 있었습니다.<br />
하지만 청중의 커서를 실시간으로 공유하거나, 발표자의 주석이 해상도와 무관하게 정확한 위치에 렌더링되도록 만드는 구조를 고민하면서
**어떻게 데이터를 설계하고 전달해야, 사용자가 내가 의도한 화면을 정확히 경험할 수 있을까?** 라는 질문을 끊임없이 던지게 되었습니다.
그 과정에서 기능 구현을 넘어 전체 데이터 흐름과 상태 구조를 어떻게 설계할지에 대한 고민을 깊게 해볼 수 있었습니다.

무엇보다 인상 깊었던 건, 기술적인 구조는 결국 UX를 고민하는 과정에서 자연스럽게 따라왔다는 사실입니다.<br />
예를 들어, 발표자가 슬라이드를 넘기면 청중도 실시간으로 같은 화면을 봐야 하고,
중간에 입장한 청중도 동일한 상태를 받아야 하며,
화면 해상도가 달라도 주석의 위치가 정확히 일치해야 했습니다.
이러한 사용자 경험을 보장하기 위해 서버의 상태 구조, 소켓 이벤트 흐름, 클라이언트 렌더링 방식까지 여러 차례 설계하고 다듬는 과정을 거쳤고,
그 속에서 **기술은 단순한 구현 수단이 아니라 경험을 설계하기 위한 도구**라는 사실을 자연스럽게 체득할 수 있었습니다.

이번 프로젝트는 단순히 기능을 만들었다는 것을 넘어,
**사용자 흐름 속에서 자연스럽게 파생된 요구사항**들을 스스로 정의하고,
그 흐름을 기술로 실현해 나가는 전 과정을 **처음부터 끝까지 주도적으로 경험**해봤다는 점에서 가장 큰 의미가 있었습니다.

앞으로도 작은 기능 하나를 만들더라도 그 기능이 어떤 맥락에서 작동하는지, 어떤 흐름 속에 있어야 자연스러운지 고민하는 개발자로 성장하고 싶습니다.<br />
