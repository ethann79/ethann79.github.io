// EDIT YOUR PERSONAL TEXT, LINKS, AND PROJECTS HERE.
// Keep the double quotes, commas, and brackets. Save, then refresh your browser.
// Put map images and PDFs in assets/. Use paths such as "assets/my-map.png".
// Empty image, PDF, resume, and contact fields stay hidden or show a placeholder.
// The Tokyo background is decoration, not one of your projects.
// Your original video and map have not been changed.
window.PORTFOLIO = {
  "profile": {
    "name": "Ethan Niu",
    "portrait": "assets/ethan-portrait.jpg?v=20260922-5",
    "program": "Systems Design Engineering",
    "university": "University of Waterloo",
    "introduction": "Maps, research, and projects that explore the places around us.",
    "opportunity": {
      "lead": "Seeking Summer 2027 ",
      "emphasis": "Internship Opportunities."
    },
    "availability": "Interested in TTC, Metrolinx, BA Consulting Group, etc...",
    "about": [
      "I'm a first year student at the University of Waterloo studying Systems Design Engineering (SYDE) with an interest in public transportation, urban infastructure, map design, and SWE.",
      "Driven by my personal experiences with transit across Toronto and visits to other cities, I enjoy pursuing personal projects which model how well-planned transportation and thoughtful urban accessibility can improve cities and enhance people’s quality of life."
    ],
    "education": "Systems Design Engineering at UWaterloo",
    "studyPeriod": "First Year",
    "skills": [
      "Spatial Analysis",
      "Java",
      "C++",
      "GIS and Cartography",
      "AI Skills",
      "Front-End Development"
    ],
    "interests": "Outside of coursework and building maps, I love side-questing by attending random events, reading up on history, and playing hockey or badminton. I'm also an avid hockey and soccer fan, so feel free to reach out below!",
    "email": "ethanniu79@gmail.com or e2niu@uwaterloo.ca",
    "contactEmail": "ethanniu79@gmail.com",
    "linkedin": "www.linkedin.com/in/ethan-niu-1aa928310",
    "github": "ethann79",
    "Instagram": "ethnniu",
    "resume": "assets/Ethan-Niu-Resume.pdf?v=20260921-3",
    "greeting": "Hello, I’m"
  },
  "projects": [
    {
      "id": "map-project-one",
      "title": "Toronto Accessibility Heatmap",
      "category": "Mapping",
      "year": "2026",
      "summary": "An accessibility heatmap of Toronto based on five major amenities, paired with dissemination-area population data to identify where access gaps affect the most residents.",
      "cardSummary": "Toronto accessibility map based on five major amenities, with dissemination-area population data that helps identify where access gaps affect the most residents.",
      "image": "",
      "previewImage": "assets/toronto-accessibility-heatmap-preview.jpg",
      "imageAlt": "Toronto accessibility heatmap showing access to five major amenities and under-served areas",
      "caption": "Interactive Toronto accessibility heatmap based on subway stations, supermarkets, hospitals, schools, and community centres. Click any dissemination area to view its accessibility tier, population, mean score, land area, and population density.",
      "interactiveMap": "assets/project-one-map/index.html?v=20260929-2",
      "tools": [
        "QGIS and Google Sheets",
        "Spatial Analysis"
      ],
      "context": "Personal Project",
      "overview": "This project explores how evenly access to essential amenities is distributed across Toronto. Using five major amenity categories, I created a combined accessibility heatmap to make high-access clusters and under-served areas easier to identify. I further added population data for designated areas so it is evident how many people may be affected by accessibility gaps.",
      "process": "I collected and organized the locations for each amenity category, mapped them in a GIS workflow, and created heatmap layers to show where services are concentrated. I weighted subway stations at 35%, supermarkets at 20%, hospitals at 20%, schools at 20%, and community centres at 5%. After combining the layers, I calculated a mean accessibility score for each dissemination area, joined the corresponding 2021 population counts, and classified every area into a Low, Medium, or High accessibility tier. The completed interactive map lets visitors click any dissemination area to inspect its tier, population, mean score, land area, and population density.",
      "outcome": "The completed analysis covers 3,800 Toronto dissemination areas representing 2,794,356 residents. Of those areas, 2,262 fall into the Low accessibility tier and contain approximately 1.57 million residents, highlighting where access gaps may affect the greatest number of people. The map also shows stronger concentrations of amenities in central Toronto and along several major corridors. Because proximity alone does not capture every part of accessibility, a future version could also consider travel time, service quality, affordability, and mobility needs.",
      "pdf": "",
      "liveUrl": "",
      "sourceUrl": ""
    },
    {
      "id": "map-project-two",
      "title": "Toronto Subway & LRT Redesign",
      "category": "Mapping",
      "year": "2025",
      "summary": "Inspired by trips to public transit oriented cities such as Munich and Tokyo, this project envisions a what if scenario where Toronto invested heavily in subways and light rail.",
      "image": "assets/fantasy-ttc-map.png",
      "previewImage": "assets/fantasy-ttc-map-preview.png",
      "imageAlt": "Fantasy TTC subway and light rail network map of the Greater Toronto Area",
      "caption": "Fantasy TTC subway and light rail network map.",
      "zoomable": true,
      "tools": [
        "QGIS, MetroMapMaker, Codex"
      ],
      "context": "Personal Project",
      "overview": "This project is a potential future model of Toronto's subway and light rail system (TTC), created with bus and streetcar ridership numbers as well as future development plans in mind.",
      "process": "I reviewed bus and streetcar ridership patterns, existing TTC corridors, planned rapid transit projects, and areas expected to grow through future development. I used those factors to decide where new lines and extensions could serve the most riders, improve connections between suburban centres, and reduce transfers. I also considered environmental concerns by favouring routes that could shift trips from cars to transit while avoiding unnecessary disruption to sensitive or constrained areas. After sketching the network, I refined station spacing, interchange points, line colours, and labels to make the final map easy to read.",
      "outcome": "The finished map presents a connected 12-line subway and light rail network that expands service across Toronto and the surrounding region, adds more cross-city travel options, and creates stronger interchange points. The project helped me combine ridership and planning considerations with cartographic design while showing how future growth and environmental priorities can influence transit decisions. Although the network is conceptual, it provides a clear basis for discussing where expanded rapid transit could have the greatest impact.",
      "pdf": "",
      "liveUrl": "",
      "sourceUrl": ""
    },
    {
      "id": "nextstop-game",
      "title": "Nextstop Game",
      "category": "Game",
      "year": "2026",
      "summary": "A Toronto transit planning game about choosing projects and shaping the city's network over the next fifty years.",
      "cardSummary": "A Toronto transit planning game about choosing projects and shaping the city's network over the next fifty years.",
      "image": "assets/nextstop-logo.svg",
      "previewImage": "assets/nextstop-logo.svg",
      "imageLink": "https://nextstoptoronto.vercel.app/",
      "imageAlt": "Nextstop wordmark on a dark green background",
      "caption": "Nextstop — a Toronto transit planning game.",
      "tools": [
        "Front-End Development"
      ],
      "context": "Partner Project",
      "overview": "",
      "process": "In production",
      "outcome": "In production",
      "pdf": "",
      "liveUrl": "https://nextstoptoronto.vercel.app/",
      "sourceUrl": ""
    }
  ],
  "backgrounds": {
    "video": "assets/tokyo-trains.mp4",
    "poster": "assets/tokyo-poster.jpg",
    "map": "assets/tokyo-subway-map.png",
    "videoPosition": "55% 50%",
    "mapPosition": "50% 48%",
    "mapCredit": "Tokyo rail map · Jug Cerović / inat.fr",
    "mapCreditUrl": "https://www.inat.fr/"
  }
};
