# [토닥 서비스 바로가기 🔗](https://www.todoc.kr/) <img width="100" height="100" alt="Logo" src="https://github.com/user-attachments/assets/de2ea90e-a5b3-46da-9320-936e2791d4da" width="100px" align="left" />

낯선 병원길에 따듯한 동행을 더하는 케어 파트너

<img width="100%" alt="todoc-cover" src="https://github.com/user-attachments/assets/13f64524-d4b3-4875-b061-bb4cb26d0856" />

<br />
<br />

## 🖥️ 서비스 플로우
> 모든 화면은 실제 구현된 서비스를 캡처한 것입니다.

### 보호자 화면
<img width="100%" height="1080" alt="보호자 01" src="https://github.com/user-attachments/assets/5b7bed19-8b29-4184-8a20-439a8120c15c" />
<img width="100%" height="1080" alt="보호자 02" src="https://github.com/user-attachments/assets/63ff95d5-952e-40e6-91cd-1dadbc6d8a0a" />

### 도우미 화면
<img width="100%" height="1080" alt="도우미 01" src="https://github.com/user-attachments/assets/1a3b9332-f097-482d-9a8e-2dd5febc66a8" />
<img width="100%" height="1080" alt="도우미 02" src="https://github.com/user-attachments/assets/51d22eb0-c21c-49dd-a57b-ed650c43e9a5" />

### 동행 화면
<img width="100%" height="1080" alt="동행 01" src="https://github.com/user-attachments/assets/8390c549-3b0e-4df2-ace9-9cb6f38be758" />
<img width="100%" height="1080" alt="동행 02" src="https://github.com/user-attachments/assets/c2734f40-8379-4b8a-a9cc-69929c8f6a22" />

### 동행 대시보드 시연 영상

https://github.com/user-attachments/assets/6addc266-0bfe-4021-b485-d3ada52e9a7c



<br />
<br />

## 🏛️ 아키텍처 구조
<img width="100%" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/5ff75a72-1ec2-46b1-a711-13ebd7979e72" />

<br />
<br />

## 🛠️ 기술 스택

<table width="100%">
  <thead>
    <tr>
      <th align="center">팀</th>
      <th align="center">Tech Stack</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">Backend</td>
      <td align="start">
        <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
        <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
	    <img src="https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=java&logoColor=white" alt="JPA" />
	<img src="https://img.shields.io/badge/QueryDSL-1D3557?style=for-the-badge&logo=apache&logoColor=white" alt="QueryDSL" />
	<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    	<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
	<img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
      </td>
    </tr>
    <tr>
      <td align="center">Frontend</td>
      <td align="start">
        <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
        <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
        <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
        <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
        <img src="https://img.shields.io/badge/TanStack%20Router-FF4154?style=for-the-badge&logo=reactrouter&logoColor=white" alt="TanStack Router" />
        <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
      </td>
    </tr>
  </tbody>
</table>
<br />
<br />


## 🗂️ 폴더구조

<details>
<summary > 백엔드 폴더 구조 보기 </summary>
	
```
com.todoc.server
├─ 📁 common/
│  ├─ 📁 config/
│  ├─ 📁 entity/
│  ├─ 📁 enumeration/
│  ├─ 📁 exception/
│  │  ├─ 📁 base/
│  │  └─ 📁 global/
│  ├─ 📁 response/
│  └─ 📁 util/
│
├─ 📁 domain/
│  ├─ 📁 auth/
│  │  ├─ 📁 entity/
│  │  ├─ 📁 exception/
│  │  ├─ 📁 repository/
│  │  ├─ 📁 service/
│  │  └─ 📁 web/
│  │     ├─ 📁 controller/
│  │     └─ 📁 dto/
│  │        ├─ 📁 request/
│  │        └─ 📁 response/
│  │
│  ├─ 📁 customer (...)
│  ├─ 📁 escort (...)
│  ├─ 📁 helper (...)
│  ├─ 📁 realtime (...)
│  ├─ 📁 latestlocation (...)
│  ├─ 📁 report (...)
│  ├─ 📁 review (...)
│  └─ 📁 route (...)
└─ 📁 external/
   ├─ 📁 sms/
   └─ 📁 tmap/

```
</details>


<details>
<summary > 프론트엔드 폴더 구조 보기 </summary>

```
frontend
├── 📁 dist/
├── 📁 node_modules/
├── 📁 public/
│   ├── 📁 fonts/
│   ├── 📁 icons/
│   ├── 📁 images/
│   └── 📁 video/
│
├── 📁 src/
│   ├── 📁 app/
│   │   └── 📁 routes/
│   │   └── routeTree.gen.ts
│   │
│   ├── 📁 pages/
│   │   ├── 📁 auth/
│   │   ├── 📁 customer/
│   │   ├── 📁 dashboard/
│   │   └── 📁 helper/
│   │
│   ├── 📁 widgets/
│   │   └── 📁 ui/
│   │
│   ├── 📁 entities/
│   │   ├── 📁 application/
│   │   ├── 📁 customer/
│   │   ├── 📁 escort/
│   │   ├── 📁 helper/
│   │   ├── 📁 recruit/
│   │   └── 📁 user/
│   │
│   ├── 📁 shared/
│   │   ├── 📁 api/
│   │   ├── 📁 config/
│   │   ├── 📁 hooks/
│   │   ├── 📁 lib/
│   │   ├── 📁 types/
│   │   └── 📁 ui/
│   │       ├── 📁 button/
│   │       ├── 📁 feedback/
│   │       ├── 📁 form/
│   │       ├── 📁 layout/
│   │       ├── 📁 overlay/
│   │       └── 📁 shadcn/
│   │
│   ├── 📁 assets/
│   ├── 📁 mocks/
│   ├── 📁 main.tsx
│   ├── 📁 styles.css
│   └── 📁 vite-env.d.ts
│
├── 📁 .cta.json
├── 📁 .gitignore
├── 📁 .prettierignore
├── 📁 .prettierrc
├── 📁 components.json
├── 📁 eslint.config.mjs
├── 📁 index.html
├── 📁 package.json
├── 📁 pnpm-lock.yaml
├── 📁 README.md
├── 📁 tsconfig.json
├── 📁 vercel.json
└── 📁 vite.config.ts
```

</details>

<br/>
<br/>

## 😊 팀 위키 문서

📚 더 자세한 내용은 [팀 위키 문서](https://github.com/softeerbootcamp-6th/Team4-PopoPony/wiki)를 참고해주세요.  
컨벤션, 작업 전략, 도메인 정의, 온보딩 문서, 문서 템플릿 등이 정리되어 있습니다.

<br/>
<br/>


