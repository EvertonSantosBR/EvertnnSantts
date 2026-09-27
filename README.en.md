<div align="center">

<a href="./README.md"><img src="./assets/lang/pt-off.svg" height="34" alt="Ler em português"/></a><a href="./README.en.md"><img src="./assets/lang/en-on.svg" height="34" alt="English (current)"/></a>

<img src="./assets/en/hero.svg" width="100%" alt="Everton Santos — Backend Developer"/>

<img src="https://readme-typing-svg.demolab.com/?font=JetBrains+Mono&weight=500&size=19&duration=2800&pause=900&color=58A6FF&center=true&vCenter=true&width=720&height=44&lines=REST+APIs+with+Node.js%2C+Express+and+ASP.NET;Real+business+rules%3A+HR%2C+payroll+and+auditing;Relational+modeling+with+MySQL+and+SQL+Server;Exploring+computer+vision+and+Web3" alt="REST APIs with Node.js, Express and ASP.NET · business rules · MySQL and SQL Server"/>

<p><sub>
<a href="#01-about-me">about</a> &nbsp;·&nbsp;
<a href="#02-tech-stack">stack</a> &nbsp;·&nbsp;
<a href="#03-featured-projects">projects</a> &nbsp;·&nbsp;
<a href="#04-how-i-build">how I build</a> &nbsp;·&nbsp;
<a href="#05-github-in-numbers">github</a> &nbsp;·&nbsp;
<a href="#06-contact">contact</a>
</sub></p>

</div>

<br/>

## `01` About me

<img src="./assets/en/terminal.svg" width="100%" alt="Terminal: Everton Santos, Backend Developer in Salvador, Brazil. Web Development graduate, studying Information Systems at UNIFACS. Coding since 2021."/>

I'm a **back-end** developer based in Salvador, Brazil. I started in 2021 with front-end, moved through React, and today I work mainly with **Node.js/Express** and **C#/.NET** on relational databases. I enjoy systems with real business rules, such as payroll calculation, access control and auditing, and I like keeping them covered by tests.

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>⚙️ APIs & back-end</h4>
      <sub>Layered REST APIs with Express and ASP.NET, JWT authentication, role-based access control and input validation.</sub>
    </td>
    <td width="33%" valign="top">
      <h4>🗄️ Data</h4>
      <sub>Relational modeling in MySQL and SQL Server, versioned migrations, transactions and ORMs (EF Core, Sequelize).</sub>
    </td>
    <td width="33%" valign="top">
      <h4>🧪 Quality</h4>
      <sub>Automated tests with <code>node:test</code>, regression tests for calculations, Conventional Commits and a PR-based workflow.</sub>
    </td>
  </tr>
</table>

<img src="./assets/divider.svg" width="100%" alt=""/>

## `02` Tech stack

<img src="./assets/en/stack.svg" width="100%" alt="Tech stack: JavaScript, TypeScript, C#, Python, Java, Solidity, Node.js, Express, .NET, Sequelize, React, Next.js, Tailwind, Bootstrap, Electron, MySQL, SQL Server, OpenCV, scikit-learn, Git, GitHub, VS Code, Vercel; learning AWS, Docker and Linux"/>

<img src="./assets/divider.svg" width="100%" alt=""/>

## `03` Featured projects

<p align="center">
  <img src="./assets/en/projects/peopleos.svg" width="100%" alt="PeopleOS: HR and payroll system built with Node.js, Express 5 and MySQL"/>
</p>

<p align="center">
  <a href="https://github.com/EvertonSantosBR/LIBRAS-Bridge"><img src="./assets/en/projects/libras-bridge.svg" width="49%" alt="LIBRAS Bridge"/></a>
  <a href="https://github.com/EvertonSantosBR/GreenChain"><img src="./assets/en/projects/greenchain.svg" width="49%" alt="GreenChain"/></a>
</p>

<p align="center">
  <a href="https://github.com/EvertonSantosBR/BiblioControle"><img src="./assets/en/projects/bibliocontrole.svg" width="49%" alt="BiblioControle"/></a>
  <a href="https://github.com/EvertonSantosBR/APPWEB---IEL"><img src="./assets/en/projects/appweb-iel.svg" width="49%" alt="Student Management — IEL"/></a>
</p>

<details>
<summary><b>Other repositories</b></summary>
<br/>

| Project | What it is | Stack |
| --- | --- | --- |
| [CadastroApp](https://github.com/EvertonSantosBR/CadastroApp) | Console user CRUD with input validation | C# · .NET |
| [StoreManagement](https://github.com/EvertonSantosBR/StoreManagement) | Store management (products, staff, cash register), a university team project | Java |
| [Usurport](https://github.com/EvertonSantosBR/Usurport) | Data processing for federal highways in Bahia *(in progress)* | Python |

</details>

<img src="./assets/divider.svg" width="100%" alt=""/>

## `04` How I build

| Area | What I've put into practice | Where |
| --- | --- | --- |
| **Architecture** | Layers `routes → middlewares → controllers → services → repositories`; MVC in .NET and Python | PeopleOS · IEL · LIBRAS Bridge |
| **Security** | JWT, bcrypt password hashing, role- and unit-based authorization, access logging | PeopleOS |
| **Business rules** | Payroll engine: 13th salary in installments, prorated pay, alimony, PDF payslips | PeopleOS |
| **Data** | Relational modeling, migrations, transactions, EF Core on SQL Server | PeopleOS · IEL · BiblioControle |
| **Testing** | 20+ suites with `node:test`, including payslip regression and payroll scenarios | PeopleOS |
| **Beyond back-end** | Computer vision and ML (MediaPipe, scikit-learn); Solidity contracts and Web3 | LIBRAS Bridge · GreenChain |

<details>
<summary><b>See how a request flows through PeopleOS</b></summary>
<br/>

```mermaid
flowchart LR
    C([React client]) -->|HTTP + JWT| R[Routes]
    R --> M{{"Middlewares<br/>auth · role · unitScope · validate"}}
    M --> CT[Controllers]
    CT --> S["Services<br/>business rules"]
    S --> RP[Repositories]
    RP --> DB[(MySQL)]
    S -.-> A[["Audit and access log"]]
    S -.-> P[["PDF payslip"]]
```

</details>

<img src="./assets/divider.svg" width="100%" alt=""/>

## `05` GitHub in numbers

<p align="center">
  <img src="./assets/en/generated/stats.svg" width="49%" alt="GitHub stats"/>
  <img src="./assets/en/generated/languages.svg" width="49%" alt="Most used languages"/>
</p>

<p align="center">
  <img src="https://streak-stats.demolab.com/?user=EvertonSantosBR&locale=en&border_radius=16&background=0D1117&border=30363D&stroke=30363D&ring=58A6FF&fire=58A6FF&currStreakNum=E6EDF3&sideNums=E6EDF3&currStreakLabel=58A6FF&sideLabels=8B949E&dates=6E7681&card_width=1000" width="100%" alt="Contribution streak"/>
</p>

<img src="./assets/generated/snake-dark.svg" width="100%" alt="Contribution graph being eaten by a snake"/>

<img src="./assets/divider.svg" width="100%" alt=""/>

## `06` Contact

<div align="center">

Want to talk about back-end, a project or an opportunity? Feel free to reach out.

<br/>

<a href="https://www.linkedin.com/in/evertonferreira7/"><img src="./assets/en/contact/linkedin.svg" width="185" alt="LinkedIn"/></a>
<a href="mailto:evertnnsantts@gmail.com"><img src="./assets/en/contact/email.svg" width="185" alt="Email"/></a>
<a href="https://everton-brown.vercel.app/"><img src="./assets/en/contact/portfolio.svg" width="185" alt="Portfolio"/></a>
<a href="https://cal.com/evertnnsantts/evortonsantts"><img src="./assets/en/contact/agenda.svg" width="185" alt="Book a call"/></a>

<img src="./assets/en/footer.svg" width="100%" alt="Thanks for visiting"/>

<img src="https://komarev.com/ghpvc/?username=EvertonSantosBR&label=views&color=1f6feb&style=flat-square" alt="Profile views"/>

</div>
